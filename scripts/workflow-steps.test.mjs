import {test} from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import {createRequire} from "node:module"
import ts from "typescript"
const require=createRequire(new URL("../packages/ui/package.json",import.meta.url))
const {createElement:h}=require("react")
const {renderToStaticMarkup:render}=require("react-dom/server")
const cache=new Map()
function load(name){if(cache.has(name))return cache.get(name);const source=fs.readFileSync(new URL(`../packages/ui/src/${name}`,import.meta.url),"utf8");const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;const exports={};new Function("require","exports",output)(specifier=>specifier==="@mogi-ui/ui/lib/utils"?load("lib/utils.ts"):require(specifier),exports);cache.set(name,exports);return exports}
const {WorkflowSteps}=load("components/ui/workflow-steps.tsx")
const steps=[{id:"a",label:"实现",state:"completed"},{id:"b",label:"评审",state:"blocked"},{id:"c",label:"验收",state:"unknown"}]
test("static steps preserve caller state without inventing completion or controls",()=>{
  const html=render(h(WorkflowSteps,{steps}));assert.match(html,/<ol/);assert.equal((html.match(/<li /g)||[]).length,3);assert.match(html,/data-state="unknown"/);assert.match(html,/未知/);assert.doesNotMatch(html,/<button|progressbar|aria-current=/)
})
test("selection uses non-submit buttons and reports selection separately from active state",()=>{
  const html=render(h("form",null,h(WorkflowSteps,{steps,selectedStepId:"b",onStepSelect:()=>{}})));const buttons=html.match(/<button[^>]*>/g)||[];assert.equal(buttons.length,3);for(const button of buttons)assert.match(button,/type="button"/);assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);assert.match(html,/data-state="blocked"/);assert.doesNotMatch(html,/aria-current=/)
})
test("running steps expose current step and reduced-motion-safe activity",()=>{
  const html=render(h(WorkflowSteps,{steps:[{id:"a",label:"执行",state:"running"}]}));assert.match(html,/aria-current="step"/);assert.match(html,/motion-reduce:animate-none/)
})
test("unknown runtime values are visible and arbitrary text stays escaped",()=>{
  const html=render(h(WorkflowSteps,{steps:[{id:"a",label:"<script>alert(1)</script>",state:"unrecognized"}]}));assert.match(html,/data-state="unknown"/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/)
})
test("vertical orientation, metadata, disabled state and translated labels remain accessible",()=>{
  const html=render(h(WorkflowSteps,{"aria-label":"发布流程",orientation:"vertical",steps:[{id:"a",label:"核对",state:"blocked",meta:"模型未观测",disabled:true}],stateLabels:{blocked:"需要确认"},onStepSelect:()=>{}}));assert.match(html,/aria-label="发布流程"/);assert.match(html,/data-orientation="vertical"/);assert.match(html,/disabled/);assert.match(html,/需要确认/);assert.match(html,/模型未观测/)
})
test("empty workflows remain valid semantic lists",()=>{const html=render(h(WorkflowSteps,{steps:[]}));assert.match(html,/<ol/);assert.doesNotMatch(html,/<li|button/);assert.doesNotMatch(html,/100%|已完成/)})
