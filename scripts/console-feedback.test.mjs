import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { createRequire } from "node:module"
import ts from "typescript"
import { contrast } from "../packages/tokens/src/contrast.js"

const require = createRequire(new URL("../packages/ui/package.json", import.meta.url))
const { createElement: h } = require("react")
const { renderToStaticMarkup } = require("react-dom/server")
const { useForm } = require("react-hook-form")
const { CheckCircle2 } = require("lucide-react")
const cache = new Map()
function load(name) {
  if (cache.has(name)) return cache.get(name)
  const source = fs.readFileSync(new URL(`../packages/ui/src/${name}`, import.meta.url), "utf8")
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  const exports = {}
  new Function("require", "exports", output)(specifier => {
    if (specifier.startsWith("@mogi-ui/ui/components/")) return load(`components/ui/${specifier.split("/").at(-1)}.tsx`)
    if (specifier === "@mogi-ui/ui/lib/utils") return load("lib/utils.ts")
    return require(specifier)
  }, exports)
  cache.set(name, exports)
  return exports
}
const { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } = load("components/ui/form.tsx")
const { Input } = load("components/ui/input.tsx")
const { PasswordInput } = load("components/ui/password-input.tsx")
const { MetricCard } = load("components/ui/metric-card.tsx")
const { StatusBadge } = load("components/ui/status-badge.tsx")
const { Badge } = load("components/ui/badge.tsx")
const { Table, TableBody, TableRow } = load("components/ui/table.tsx")
const { TableCellTruncate } = load("components/ui/table-cell-truncate.tsx")
const { DescriptionList, DescriptionItem } = load("components/ui/description-list.tsx")
function formMarkup({ itemId, controlId, childId, password = false, wrapperId } = {}) {
  function Fixture() {
    const methods = useForm({ defaultValues: { name: "" } })
    return h(Form, methods, h(FormField, { control: methods.control, name: "name", render: ({ field }) => h(FormItem, { itemId, id: wrapperId },
      h(FormLabel, null, "用户名"), h(FormControl, { id: controlId }, h(password ? PasswordInput : Input, { ...field, id: childId })), h(FormDescription, null, "说明")) }))
  }
  return renderToStaticMarkup(h(Fixture))
}
function ids(html) {
  return { label: html.match(/<label[^>]*for="([^"]+)"/)[1], input: html.match(/<input[^>]*\sid="([^"]+)"/)[1] }
}
test("explicit child ID is preserved and shared by FormLabel before hydration", () => {
  assert.deepEqual(ids(formMarkup({ childId: "login-username" })), { label: "login-username", input: "login-username" })
})
test("FormItem.itemId is canonical even when slot/child supply different IDs", () => {
  const html = formMarkup({ itemId: "canonical", childId: "old-child", controlId: "old-slot", wrapperId: "wrapper" })
  assert.deepEqual(ids(html), { label: "canonical", input: "canonical" })
  assert.match(html, /data-slot="form-item"[^>]*id="wrapper"/)
  assert.match(html, /aria-describedby="[^"]+form-item-description"/)
})
test("FormControl explicit ID is shared, generated IDs remain matched and unique", () => {
  assert.deepEqual(ids(formMarkup({ controlId: "slot-id", childId: "child-id" })), { label: "slot-id", input: "slot-id" })
  const { label, input } = ids(formMarkup())
  assert.equal(label, input)
  assert.match(input, /form-item$/)
  function Pair() { return h("div", null, h(Generated), h(Generated)) }
  function Generated() { const methods = useForm({ defaultValues: { name: "" } }); return h(Form, methods, h(FormField, { control: methods.control, name: "name", render: ({ field }) => h(FormItem, null, h(FormLabel, null, "名称"), h(FormControl, null, h(Input, field))) })) }
  const html = renderToStaticMarkup(h(Pair))
  const values = [...html.matchAll(/<input[^>]*\sid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(values).size, 2)
})
test("PasswordInput receives form ID and ARIA props on actual input; toggle is not submit", () => {
  const html = formMarkup({ itemId: "login-password", password: true })
  assert.deepEqual(ids(html), { label: "login-password", input: "login-password" })
  assert.match(html, /<input[^>]*type="password"/)
  assert.match(html, /<input[^>]*aria-describedby=/)
  assert.match(html, /<button[^>]*type="button"/)
  assert.match(html, /aria-label="显示口令"/)
  assert.match(html, /aria-pressed="false"/)
})
test("StatusBadge maps known statuses and treats null and prototype names as unknown", () => {
  const map = { fresh: { label: "在线", icon: CheckCircle2, variant: "success" }, stale: { label: "上次报告 · 就绪", variant: "historical" } }
  assert.match(renderToStaticMarkup(h(StatusBadge, { value: "fresh", map })), />在线</)
  assert.match(renderToStaticMarkup(h(StatusBadge, { value: "stale", map })), /border-dashed/)
  for (const value of [null, undefined, "constructor", "toString", "__proto__", "unmapped"]) {
    const html = renderToStaticMarkup(h(StatusBadge, { value, map, unknownLabel: "未知状态" }))
    assert.match(html, />未知状态</)
    assert.match(html, /<svg/)
  }
})
test("MetricCard renders numeric zero, units and explanatory text without inventing state", () => {
  const html = renderToStaticMarkup(h(MetricCard, { label: "异常", value: 0, unit: "项", hint: "演示数据", tone: "warning" }))
  assert.match(html, /<dt[^>]*>异常<\/dt>/)
  assert.match(html, /<dd[^>]*font-mono[^>]*>0/)
  assert.match(html, />项</)
  assert.match(html, />演示数据</)
  assert.match(html, /text-warning-foreground dark:text-warning/)
})
test("Truncated cells and description values retain complete escaped text", () => {
  const digest = "a".repeat(64)
  const html = renderToStaticMarkup(h(Table, { density: "compact" }, h(TableBody, null, h(TableRow, null, h(TableCellTruncate, { value: digest, mono: true, copyable: true, maxChars: 12 })))))
  assert.match(html, /data-density="compact"/)
  assert.match(html, /max-width:12ch/)
  assert.match(html, new RegExp(`title="${digest}"`))
  assert.match(html, new RegExp(`>${digest}<`))
  assert.match(html, /aria-label="复制完整内容"/)
  const details = renderToStaticMarkup(h(DescriptionList, null, h(DescriptionItem, { term: "摘要", valueVariant: "truncate" }, digest), h(DescriptionItem, { term: "哈希", valueVariant: "mono" }, "<hash>")))
  assert.match(details, new RegExp(`title="${digest}"`))
  assert.match(details, /font-mono/)
  assert.match(details, /&lt;hash&gt;/)
  assert.match(renderToStaticMarkup(h(Badge, { variant: "historical" }, "历史值")), /border-dashed/)
})
test("new metric and historical badge text tones meet 4.5:1 in both themes", () => {
  const { cssVars } = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8")).items.find(item => item.name === "mogi-theme")
  for (const mode of ["light", "dark"]) {
    const vars = cssVars[mode]
    for (const name of ["foreground", "success", "destructive", mode === "dark" ? "warning" : "warning-foreground"]) assert(contrast(vars[name], vars.card) >= 4.5, `${mode} ${name}`)
    assert(contrast(vars["muted-foreground"], vars.muted) >= 4.5)
  }
})
