import {test} from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import {createRequire} from "node:module"
import ts from "typescript"
const require=createRequire(new URL("../packages/ui/package.json",import.meta.url))
const {createElement:h}=require("react")
const {renderToStaticMarkup:render}=require("react-dom/server")
const cache=new Map()
const local=specifier=>specifier==="@mogi-ui/ui/lib/utils"?"lib/utils.ts":specifier.startsWith("@mogi-ui/ui/components/")?`components/ui/${specifier.slice("@mogi-ui/ui/components/".length)}.tsx`:null
function load(name){if(cache.has(name))return cache.get(name);const source=fs.readFileSync(new URL(`../packages/ui/src/${name}`,import.meta.url),"utf8");const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;const exports={};cache.set(name,exports);new Function("require","exports",output)(specifier=>local(specifier)?load(local(specifier)):require(specifier),exports);return exports}
const {StatusBanner}=load("components/ui/status-banner.tsx")
const {LinkList,LinkListItem}=load("components/ui/link-list.tsx")
const {MetricCard}=load("components/ui/metric-card.tsx")
const {Badge}=load("components/ui/badge.tsx")

test("urgent banners announce as alerts and carry a text label, not colour alone",()=>{
  const html=render(h(StatusBanner,{tone:"danger",label:"需要处理",title:"处理失败",action:h("a",{href:"#jobs"},"查看失败任务")}))
  assert.match(html,/data-tone="danger"/);assert.match(html,/role="alert"/);assert.match(html,/需要处理/);assert.match(html,/bg-destructive-soft/);assert.match(html,/href="#jobs"/)
})
test("calm banners use status, and unknown tones fall back to neutral",()=>{
  assert.match(render(h(StatusBanner,{tone:"success",title:"正常"})),/role="status"/)
  const html=render(h(StatusBanner,{tone:"surprise",title:"未知"}));assert.match(html,/data-tone="neutral"/);assert.match(html,/role="status"/)
})
test("banner text stays escaped and the footer sits under a divider",()=>{
  const html=render(h(StatusBanner,{title:"<b>x</b>",footer:"次要控件"}));assert.doesNotMatch(html,/<b>x<\/b>/);assert.match(html,/data-slot="status-banner-footer"/)
})
test("link lists are named navigation with one link per item and decorative icons hidden",()=>{
  const html=render(h(LinkList,{"aria-label":"入口"},h(LinkListItem,{href:"#a",title:"甲",description:"说明",trailing:"3"}),h(LinkListItem,{href:"#b",title:"乙"})))
  assert.match(html,/<nav[^>]*aria-label="入口"/);assert.equal((html.match(/<a /g)||[]).length,2);assert.match(html,/<li /);assert.doesNotMatch(html,/<svg(?![^>]*aria-hidden="true")/)
})
test("quiet metrics shrink without losing their value, and info is a tone",()=>{
  const quiet=render(h(MetricCard,{label:"保留",value:300,emphasis:"quiet"}));assert.match(quiet,/data-emphasis="quiet"/);assert.match(quiet,/text-xl/);assert.match(quiet,/300/)
  assert.match(render(h(MetricCard,{label:"信息",value:1,tone:"info"})),/text-info/)
  assert.match(render(h(MetricCard,{label:"紧凑",value:1,density:"compact"})),/py-3/)
})
test("danger and info badges use their own soft fills",()=>{
  assert.match(render(h(Badge,{variant:"danger"},"失败")),/bg-destructive-soft/)
  assert.match(render(h(Badge,{variant:"info"},"信息")),/bg-info-soft/)
})
