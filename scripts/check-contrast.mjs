import fs from "node:fs"
import assert from "node:assert/strict"
import { contrast, labelColor, composite, rgb } from "../packages/tokens/src/contrast.js"

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const declarations = (body) => Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
const primitives = declarations(read("packages/tokens/src/primitives.css").replace(/\/\*[\s\S]*?\*\//g, ""))
const css = read("packages/tokens/src/theme.css").replace(/\/\*[\s\S]*?\*\//g, "")
const block = (selector) => declarations(css.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`))[1])
const light = { ...primitives, ...block(":root") }
const dark = { ...light, ...block("\\.dark") }
const registryItems = JSON.parse(read("registry.json")).items
const registry = registryItems.find((item) => item.name === "mogi-theme").cssVars
const paperSelector = ':root[data-palette="paper"]:not(.dark)'
const paperTokens = declarations(css.match(/:root\[data-palette="paper"\]:not\(\.dark\)\s*\{([^}]+)\}/)[1])
const paperRegistry = registryItems.find(item => item.name === "mogi-theme-paper").css[paperSelector]
for (const [name, value] of Object.entries(paperTokens)) {
  assert.equal(paperRegistry[`--${name}`], value, `paper registry drift: ${name}`)
}
const resolve = (name, vars, seen = new Set()) => {
  if (seen.has(name) || !vars[name]) throw new Error(`Invalid token reference: ${name}`)
  seen.add(name)
  const ref = vars[name].match(/^var\(--([\w-]+)\)$/)
  return ref ? resolve(ref[1], vars, seen) : vars[name]
}
// Read the consumers so changes to their foregrounds or alpha fills are checked.
const destructiveConsumers = ["button", "badge"].map(name => {
  const source = read(`packages/ui/src/components/ui/${name}.tsx`)
  const classes = source.match(/destructive:\s*"([^"]+)"/)
  assert.ok(classes, `${name} destructive variant must be inspectable`)
  return [name, classes[1].split(/\s+/)]
})
let failures = 0, checks = 0
const hue = (value) => {
  const [r, g, b] = rgb(value).map(channel => channel / 255), max = Math.max(r, g, b), delta = max - Math.min(r, g, b)
  if (!delta) return 0
  const sector = max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  return sector * 60
}
const hueGap = (first, second) => { const gap = Math.abs(hue(first) - hue(second)); return Math.min(gap, 360 - gap) }
function check(name, fg, bg, minimum) {
  checks++
  const ratio = contrast(fg, bg)
  if (ratio < minimum) {
    failures++
    console.error(`FAIL ${name}: ${fg} / ${bg} = ${ratio.toFixed(3)} < ${minimum}`)
  }
}
// Known values and invalid inputs protect the threshold calculation itself.
assert.equal(contrast("#ffffff", "#000000"), 21)
assert.equal(contrast("#a65a2a", "#a65a2a"), 1)
assert.throws(() => contrast("unknown", "#ffffff"))
assert.ok(contrast("#777777", "#ffffff") < 4.5) // 4.478 must not round up to PASS
for (const [mode, vars] of Object.entries({ light, dark, paper: { ...light, ...paperTokens } })) {
  const color = (name) => resolve(name, vars)
  // Every published semantic token must match the workspace CSS.
  for (const name of mode === "paper" ? [] : Object.keys(block(mode === "light" ? ":root" : "\\.dark"))) {
    assert.equal(registry[mode][name], color(name), `${mode} registry drift: ${name}`)
  }
  const pairs = [
    ["foreground", "background"], ["card-foreground", "card"], ["popover-foreground", "popover"],
    ["primary-foreground", "primary"], ["secondary-foreground", "secondary"],
    ["muted-foreground", "muted"], ["accent-foreground", "accent"],
    ["destructive-foreground", "destructive"], ["success-foreground", "success"],
    ["success", "success-soft"], ["highlight", "highlight-soft"],
    ["destructive", "destructive-soft"], ["info", "info-soft"], ["info-foreground", "info"],
    ["foreground", "destructive-soft"], ["foreground", "info-soft"], ["foreground", "warning-soft"], ["foreground", "success-soft"],
    [mode === "dark" ? "warning" : "warning-foreground", "warning-soft"],
    ["warning-foreground", "warning"], ["sidebar-foreground", "sidebar"],
    ["sidebar-primary-foreground", "sidebar-primary"], ["sidebar-accent-foreground", "sidebar-accent"],
  ]
  for (const bg of ["background", "card", "popover"]) {
    for (const fg of ["link", "muted-foreground", "success", "highlight"]) pairs.push([fg, bg])
    for (const fg of ["border-strong", "input", "ring"]) check(`${mode} ${fg}/${bg}`, color(fg), color(bg), 3)
    check(`${mode} slider thumb border/${bg}`, color("slider-range"), color(bg), 3)
    check(`${mode} primary hover/${bg}`, color("primary-foreground"), composite(color("primary"), color(bg), .95), 4.5)
  }
  // Resting and interactive fills are alpha-composited over each supported
  // surface. Tailwind dark/hover overrides win over the unprefixed classes.
  for (const [name, classes] of destructiveConsumers) {
    for (const hovered of [false, true]) {
      const styles = {}
      for (const prefix of ["", ...(hovered ? ["hover:", "[a&]:hover:"] : []),
        ...(mode === "dark" ? ["dark:", ...(hovered ? ["dark:hover:", "dark:[a&]:hover:"] : [])] : [])]) {
        for (const utility of classes) {
          if (!utility.startsWith(prefix)) continue
          const match = utility.slice(prefix.length).match(/^(bg|text)-([\w-]+)(?:\/(\d+))?$/)
          if (match) styles[match[1]] = { token: match[2], alpha: match[3] === undefined ? 1 : Number(match[3]) / 100 }
        }
      }
      assert.ok(styles.bg && styles.text, `${name} destructive fill and text must be inspectable`)
      const paint = token => token === "white" ? "#ffffff" : token === "black" ? "#000000" : color(token)
      for (const surface of ["background", "card", "popover"]) {
        const fill = composite(paint(styles.bg.token), color(surface), styles.bg.alpha)
        const text = composite(paint(styles.text.token), fill, styles.text.alpha)
        check(`${mode} ${name} destructive ${hovered ? "hover" : "rest"}/${surface}`, text, fill, 4.5)
      }
    }
  }
  // WorkflowSteps running labels use accent-foreground on static cards and
  // on the accent fill shared by selected and hovered interactive steps.
  for (const bg of ["card", "accent"]) {
    check(`${mode} WorkflowSteps running label/${bg}`, color("accent-foreground"), color(bg), 4.5)
  }
  // Ambient gradients and glass must remain readable at every stop and at
  // conservative per-channel bounds (also covering interpolation/blur).
  const stops = ["ambient-start", "ambient-middle", "ambient-end"].map(color)
  const channels = stops.map(rgb)
  const bounds = [Math.min, Math.max].map(bound => `rgb(${[0, 1, 2].map(i => bound(...channels.map(channel => channel[i]))).join(", ")})`)
  const tint = color("glass-tint").match(/^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/)
  assert.ok(tint, `${mode} glass tint must declare its alpha explicitly`)
  const opaqueTint = `rgb(${tint.slice(1, 4).join(", ")})`
  const alpha = Number(tint[4])
  assert.ok(alpha >= 0 && alpha <= 1)
  for (const [index, background] of [...stops, ...bounds, ...stops.map(stop => composite(opaqueTint, stop, alpha))].entries()) {
    for (const fg of ["foreground", "muted-foreground", "link", "success", "highlight", "destructive", mode === "dark" ? "warning" : "warning-foreground"]) {
      check(`${mode} ambient/glass ${index} ${fg}`, color(fg), background, 4.5)
    }
  }
  // Meaning must not rest on a shade of the brand colour: action, danger, caution, success and information keep their own hues.
  const roles = ["primary", "destructive", "warning", "success", "info"]
  for (const [index, first] of roles.entries()) for (const second of roles.slice(index + 1)) {
    // Two roles may share a hue family only when lightness alone already separates them.
    const gap = hueGap(color(first), color(second)), ratio = contrast(color(first), color(second))
    checks++
    if (gap < 18 && ratio < 1.5) { failures++; console.error(`FAIL ${mode} ${first}/${second}: ${gap.toFixed(1)}° and ${ratio.toFixed(2)}:1`) }
  }
  // Paper surfaces use a contrasting ink outline, rather than luminance alone.
  if (mode === "paper") check("paper card outline/card", color("foreground"), color("card"), 3)
  else check(`${mode} card/background layer`, color("card"), color("background"), mode === "dark" ? 1.15 : 1.05)
  check(`${mode} diff deletion text/background`, color("destructive"), composite(color("destructive"), color("card"), .1), 4.5)
  check(`${mode} slider selected range/track`, color("slider-range"), color("muted"), 3)
  check(`${mode} sidebar-ring`, color("sidebar-ring"), color("sidebar"), 3)
  for (const [fg, bg] of pairs) check(`${mode} ${fg}/${bg}`, color(fg), color(bg), 4.5)
}
for (const [name, value] of Object.entries(primitives)) {
  check(`swatch ${name}`, labelColor(value, primitives["sand-950"]), value, 4.5)
}
console.log(`${checks} contrast checks; ${failures} failures (text 4.5:1, controls 3:1).`)
if (failures) process.exitCode = 1
