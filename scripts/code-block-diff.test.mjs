import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { createRequire } from "node:module"
import ts from "typescript"
import { contrast } from "../packages/tokens/src/contrast.js"

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
