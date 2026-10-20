import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { createRequire } from "node:module"
import ts from "typescript"
import { contrast, composite } from "../packages/tokens/src/contrast.js"

// Render the actual TSX components with the workspace's React dependencies.
const require = createRequire(new URL("../packages/ui/package.json", import.meta.url))
const { createElement } = require("react")
const { renderToStaticMarkup } = require("react-dom/server")
const cache = new Map()
function load(relative) {
  if (cache.has(relative)) return cache.get(relative)
  const source = fs.readFileSync(new URL(`../packages/ui/src/${relative}`, import.meta.url), "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  })
  const exports = {}
  const localRequire = (specifier) => {
    if (specifier.startsWith("@mogi-ui/ui/components/")) return load(`components/ui/${specifier.split("/").at(-1)}.tsx`)
    if (specifier === "@mogi-ui/ui/lib/utils") return load("lib/utils.ts")
    return require(specifier)
  }
  new Function("require", "exports", outputText)(localRequire, exports)
  cache.set(relative, exports)
  return exports
}
const { Diff } = load("components/ui/diff.tsx")
const { CodeBlock } = load("components/ui/code-block.tsx")
function kinds(content) {
  const html = renderToStaticMarkup(createElement(Diff, { content }))
  return [...html.matchAll(/data-line="([^"]+)"/g)].map((m) => m[1])
}

test("file headers before the first hunk retain header styling", () => {
  assert.deepEqual(kinds("diff --git a/a b/a\n--- a/a\n+++ b/a\n@@ -1 +1 @@\n-old\n+new\n same\n"),
    ["context", "hunk", "hunk", "hunk", "del", "add", "context", "context"])
})
test("triple prefixes after the first hunk are additions and deletions", () => {
  assert.deepEqual(kinds("--- a/a\n+++ b/a\n@@ -1 +1 @@\n---removed\n+++added\n---\n+++\n@@ -4 +4 @@\n++++more\n----less"),
    ["hunk", "hunk", "hunk", "del", "add", "del", "add", "hunk", "add", "del"])
})
test("a later file marker does not reset the first-hunk boundary", () => {
  assert.deepEqual(kinds("@@ -1 +1 @@\n+x\ndiff --git a/b b/b\n--- a/b\n+++ b/b\n@@ -2 +2 @@\n---x\n+++y"),
    ["hunk", "add", "context", "del", "add", "hunk", "del", "add"])
})
test("input without a hunk keeps file headers and ordinary lines", () => {
  assert.deepEqual(kinds("--- a/a\n+++ b/a\n-old\n+new\n same"), ["hunk", "hunk", "del", "add", "context"])
  assert.deepEqual(kinds(""), ["context"])
})
test("diff rows share a content-width container so backgrounds cover horizontal overflow", () => {
  const content = `@@ -1 +1 @@\n-${"removed".repeat(100)}\n+added\n context\n`
  const html = renderToStaticMarkup(createElement(Diff, { content }))
  const container = html.match(/<code data-slot="diff-lines" class="([^"]+)">([\s\S]*?)<\/code>/)
  assert.ok(container, "all diff rows have a shared width container")
  const classes = container[1].split(" ")
  for (const cls of ["block", "w-max", "min-w-full"]) {
    assert.ok(classes.includes(cls), `shared container has ${cls}`)
  }
  assert.equal((container[2].match(/data-slot="diff-line"/g) ?? []).length, content.split("\n").length)
  for (const [kind, background] of [["hunk", "bg-highlight-soft"], ["del", "bg-destructive/10"], ["add", "bg-success-soft"]]) {
    const row = container[2].match(new RegExp(`data-line="${kind}" class="([^"]+)"`))
    assert.ok(row, `renders ${kind} inside the shared container`)
    for (const cls of ["block", "px-3", background]) assert.ok(row[1].split(" ").includes(cls))
  }
  assert.match(html, /data-slot="diff-body"[^>]*class="[^"]*\boverflow-auto\b/)
})
test("numbered code uses opaque muted text with >=4.5:1 contrast in both themes", () => {
  const html = renderToStaticMarkup(createElement(CodeBlock, { numbered: true, startLine: 9 }, "first\nsecond"))
  const numbers = [...html.matchAll(/data-slot="code-block-line-number"[^>]*class="([^"]+)"[^>]*>(\d+)<\/span>/g)]
  assert.deepEqual(numbers.map((m) => m[2]), ["9", "10"])
  for (const [, classes] of numbers) {
    assert.ok(classes.split(" ").includes("text-muted-foreground"))
    assert.doesNotMatch(classes, /(?:text-muted-foreground\/|opacity-)/)
  }
  const { cssVars } = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8")).items.find((item) => item.name === "mogi-theme")
  for (const mode of ["light", "dark"]) {
    const ratio = contrast(cssVars[mode]["muted-foreground"], cssVars[mode].card)
    assert.ok(ratio >= 4.5, `${mode} line numbers: ${ratio}:1`)
    console.log(`${mode} line numbers: ${ratio.toFixed(3)}:1`)
  }
})

test("diff deletion text has >=4.5:1 contrast on its composited background in both themes", () => {
  const html = renderToStaticMarkup(createElement(Diff, { content: "@@ -1 +1 @@\n-removed\n+added" }))
  assert.match(html, /data-slot="diff"[^>]*class="[^"]*\bbg-card\b/)
  const deletion = html.match(/data-line="del"[^>]*class="([^"]+)"/)
  assert.ok(deletion, "renders a deletion line")
  const classes = deletion[1].split(" ")
  assert.ok(classes.includes("text-destructive"))
  assert.ok(classes.includes("bg-destructive/10"))
  assert.doesNotMatch(deletion[1], /(?:text-destructive\/|opacity-|!)/)
  const { cssVars } = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8")).items.find((item) => item.name === "mogi-theme")
  for (const mode of ["light", "dark"]) {
    const { destructive, card } = cssVars[mode]
    const background = composite(destructive, card, .1)
    const ratio = contrast(destructive, background)
    assert.ok(ratio >= 4.5, `${mode} diff deletion: ${ratio}:1`)
    console.log(`${mode} diff deletion: ${ratio.toFixed(3)}:1 (${destructive} on ${background})`)
  }
})
