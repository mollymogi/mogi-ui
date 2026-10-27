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
const registry = JSON.parse(read("registry.json")).items.find((item) => item.name === "mogi-theme").cssVars
const resolve = (name, vars, seen = new Set()) => {
  if (seen.has(name) || !vars[name]) throw new Error(`Invalid token reference: ${name}`)
  seen.add(name)
  const ref = vars[name].match(/^var\(--([\w-]+)\)$/)
  return ref ? resolve(ref[1], vars, seen) : vars[name]
}
let failures = 0, checks = 0
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
for (const [mode, vars] of Object.entries({ light, dark })) {
  const color = (name) => resolve(name, vars)
  // Every published semantic token must match the workspace CSS.
  for (const name of Object.keys(block(mode === "light" ? ":root" : "\\.dark"))) {
    assert.equal(registry[mode][name], color(name), `${mode} registry drift: ${name}`)
  }
  const pairs = [
    ["foreground", "background"], ["card-foreground", "card"], ["popover-foreground", "popover"],
    ["primary-foreground", "primary"], ["secondary-foreground", "secondary"],
    ["muted-foreground", "muted"], ["accent-foreground", "accent"],
    ["destructive-foreground", "destructive"], ["success-foreground", "success"],
    ["success", "success-soft"], ["highlight", "highlight-soft"],
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
