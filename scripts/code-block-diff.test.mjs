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
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
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

const { fileTypeOf, FileTypeIcon, fileToneClass } = load("components/ui/file-type-icon.tsx")
const { highlightCode, codeLanguage, syntaxToneClass } = load("components/ui/code-highlighter.tsx")
const reconstruct = lines => lines.map(line => line.segments.map(segment => segment.text).join("") + line.ending).join("")

test("file types classify source, headers, configs, images, compound archives and unknown files", () => {
  for (const [name, label] of [["a.CPP", "C/C++ 源码"], ["x.hpp", "头文件"], ["build.sh", "脚本"], ["x.json", "配置文件"], ["README.md", "文档"], ["a.png", "图片"], ["bundle.tar.gz", "归档"], ["CMakeLists.txt", "CMake"], ["blob", "文件"], ["a.constructor", "文件"]]) {
    assert.equal(fileTypeOf(name).label, label)
  }
  assert.equal(fileTypeOf("C:\\src\\a.cpp").label, "C/C++ 源码")
  assert.equal(fileTypeOf("file.bin").kind, "binary")
})
test("explicit file kind wins over extension and extension overrides", () => {
  assert.equal(fileTypeOf("folder.cpp", { kind: "directory" }).kind, "directory")
  assert.equal(fileTypeOf("current.cpp", { kind: "symlink" }).label, "符号链接")
  assert.equal(fileTypeOf("README.md", { kind: "binary" }).label, "二进制")
  assert.equal(fileTypeOf("a.cpp", { overrides: { cpp: { label: "自定义 C++", tone: "success" } } }).label, "自定义 C++")
  assert.equal(fileTypeOf("a.custom", { overrides: { custom: { label: "特殊文件" } } }).label, "特殊文件")
  assert.equal(fileTypeOf("bundle.tar.gz", { overrides: { gz: { label: "单层压缩" }, "tar.gz": { label: "归档覆盖" } } }).label, "归档覆盖")
  assert.equal(fileTypeOf("a.cpp", { overrides: { "a.cpp": { label: "特定文件" } } }).label, "特定文件")
})
test("FileTypeIcon uses accessible label, 16px size and semantic tone", () => {
  const html = renderToStaticMarkup(createElement(FileTypeIcon, { name: "main.cpp" }))
  assert.match(html, /aria-label="C\/C\+\+ 源码"/)
  assert.match(html, /size-4/)
  assert.match(html, /text-link/)
  assert.deepEqual(Object.keys(fileToneClass).sort(), ["highlight", "muted", "primary", "success", "warning"])
})
test("language detection handles supported aliases and paths, unknown values stay plain", () => {
  assert.equal(codeLanguage("C++"), "cpp")
  assert.equal(codeLanguage(undefined, "/work/CMakeLists.txt"), "cmake")
  assert.equal(codeLanguage(undefined, "C:\\src\\a.hpp"), "cpp")
  assert.equal(codeLanguage("unknown", "a.cpp"), undefined)
  assert.equal(codeLanguage(undefined, "a.constructor"), undefined)
  assert.equal(codeLanguage("toString"), undefined)
})
test("all supported grammars preserve source text, CRLF, empty lines and trailing newline", () => {
  const fixtures = {
    c: '#include <stdio.h>\nint main(void) { return 42; }\n',
    cpp: '/* start\r\nstill comment */\r\nconst char* x = "hello";\r\n\r\n',
    cmake: 'cmake_minimum_required(VERSION 3.20)\nset(NAME "mogi")\n',
    bash: '#!/bin/bash\nprintf "%s\\n" "$HOME"\n',
    python: 's = """first\nsecond"""\nprint(42)\n',
    json: '{\n  "name": "mogi", "count": 42\n}\n',
    markdown: '# Heading\n\n**bold** and `code`\n',
    yaml: 'name: mogi\ncount: 42\n',
    javascript: 'const message = "mogi";\n',
    typescript: 'const count: number = 42;\n',
  }
  for (const [language, source] of Object.entries(fixtures)) assert.equal(reconstruct(highlightCode(source, language)), source, language)
  assert.equal(reconstruct(highlightCode("", "cpp")), "")
  assert.equal(reconstruct(highlightCode("a\rb\r", "unknown")), "a\rb\r")
})
test("multiline comment and JSON keys retain semantic token types", () => {
  const cpp = highlightCode('/* first\nsecond */\n#include <iostream>\nint main() { return 42; }', "cpp")
  assert(cpp[0].segments.some(segment => segment.tone === "comment"))
  assert(cpp[1].segments.some(segment => segment.tone === "comment"))
  assert(cpp[2].segments.some(segment => segment.tone === "meta"))
  const json = highlightCode('{"name": "mogi", "count": 42}', "json").flatMap(line => line.segments)
  assert(json.some(segment => segment.tone === "key" && segment.text.includes('"name"')))
  assert(json.some(segment => segment.tone === "number"))
})
test("highlighted CodeBlock keeps numbering, escapes markup and falls back safely", () => {
  const html = renderToStaticMarkup(createElement(CodeBlock, { numbered: true, startLine: 20, language: "cpp" }, 'const char* x = "<script>&";\n// end\n'))
  assert.match(html, /data-token="string"/)
  assert.match(html, /&lt;script&gt;&amp;/)
  assert.doesNotMatch(html, /<script>/)
  const numbers = [...html.matchAll(/data-slot="code-block-line-number"[^>]*>(\d+)<\/span>/g)].map(match => match[1])
  assert.deepEqual(numbers, ["20", "21", "22"])
  assert.match(html, /select-none/)
  const fallback = renderToStaticMarkup(createElement(CodeBlock, { language: "unknown", numbered: true }, '<unknown>'))
  assert.match(fallback, /data-token="plain"/)
  assert.match(fallback, /&lt;unknown&gt;/)
  assert.match(renderToStaticMarkup(createElement(CodeBlock, { language: "cpp" }, createElement("b", null, "existing child"))), /<b>existing child<\/b>/)
})
test("all syntax and file icon foreground combinations pass 4.5:1 on code/card surfaces", () => {
  const { cssVars } = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8")).items.find(item => item.name === "mogi-theme")
  for (const [mode, vars] of Object.entries({ light: cssVars.light, dark: cssVars.dark })) {
    for (const [tone, classes] of Object.entries({ ...syntaxToneClass, ...fileToneClass })) {
      const fg = classes === "text-warning-foreground dark:text-warning" ? vars[mode === "dark" ? "warning" : "warning-foreground"] : vars[classes.slice(5)]
      for (const background of [vars.card, vars.background]) assert(contrast(fg, background) >= 4.5, `${mode} ${tone}`)
    }
  }
})
