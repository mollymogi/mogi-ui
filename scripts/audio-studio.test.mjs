import {test} from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import {createRequire} from "node:module"
import ts from "typescript"
const require=createRequire(new URL("../packages/ui/package.json",import.meta.url))
const {createElement:h}=require("react")
const {renderToStaticMarkup:render}=require("react-dom/server")
const cache=new Map()
function load(name){if(cache.has(name))return cache.get(name);const source=fs.readFileSync(new URL(`../packages/ui/src/${name}`,import.meta.url),"utf8");const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;const exports={};new Function("require","exports",output)(specifier=>{if(specifier.startsWith("@mogi-ui/ui/components/"))return load(`components/ui/${specifier.split("/").at(-1)}.tsx`);if(specifier==="@mogi-ui/ui/lib/utils")return load("lib/utils.ts");return require(specifier)},exports);cache.set(name,exports);return exports}
const {TaskProgress}=load("components/ui/task-progress.tsx")
const {ChoiceCards}=load("components/ui/choice-cards.tsx")
const {FileDropzone}=load("components/ui/file-dropzone.tsx")
const {AudioPreview}=load("components/ui/audio-preview.tsx")
const {ToolPageLayout,ContentPageLayout}=load("components/ui/tool-page-layout.tsx")
test("unknown progress is truly indeterminate, finite values clamp, terminal states do not imply in-flight progress",()=>{
 for(const value of [undefined,NaN,Infinity])assert.doesNotMatch(render(h(TaskProgress,{label:"等待真实事件",value})),/<progress[^>]*value=/)
 assert.match(render(h(TaskProgress,{label:"进度",value:150})),/<progress[^>]*value="100"/)
 assert.match(render(h(TaskProgress,{label:"进度",value:-2})),/<progress[^>]*value="0"/)
 for(const state of ["success","error","cancelled"]){const html=render(h(TaskProgress,{label:"明确状态",state,onCancel:()=>{}}));assert.doesNotMatch(html,/<progress|<button/);assert.match(html,new RegExp(`data-state="${state}"`))}
 assert.match(render(h(TaskProgress,{label:"失败",state:"error"})),/role="alert"/)
})
test("radio groups have independent automatic names, native values and disabled semantics",()=>{
 const props={legend:"方式",value:"a",onValueChange:()=>{},options:[{value:"a",label:"方式 A"},{value:"b",label:"方式 B",disabled:true}]}
 const html=render(h("form",null,h(ChoiceCards,props),h(ChoiceCards,{...props,disabled:true})))
 const names=[...html.matchAll(/type="radio"[^>]*name="([^"]+)"/g)].map(x=>x[1]);assert.equal(names.length,4);assert.equal(names[0],names[1]);assert.notEqual(names[0],names[2]);assert.match(html,/<fieldset[^>]*disabled/);assert.match(html,/value="a"/)
})
test("file selection and cancellation never submit a surrounding form",()=>{
 const html=render(h("form",null,h(FileDropzone,{onFileChange:()=>{},label:"选择音频",disabled:true}),h(TaskProgress,{label:"任务",onCancel:()=>{}})))
 const buttons=[...html.matchAll(/<button[^>]*>/g)].map(x=>x[0]);assert.equal(buttons.length,2);for(const button of buttons)assert.match(button,/type="button"/);assert.match(html,/<input[^>]*disabled/)
})
test("audio uses unique accessible labels, controls and never auto-plays even with untyped input",()=>{
 const html=render(h("div",null,h(AudioPreview,{label:"原曲",src:"blob:example",autoPlay:true}),h(AudioPreview,{label:"结果"})))
 assert.doesNotMatch(html,/autoPlay|autoplay/);const labels=[...html.matchAll(/<p id="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(labels).size,2);for(const label of labels)assert.ok(html.includes(`aria-labelledby="${label}"`));assert.match(html,/<audio[^>]*controls/)
})
test("page templates retain one main and caller reading order without requiring an aside",()=>{
 const html=render(h(ToolPageLayout,{navigation:"NAV",hero:"HERO",aside:"ASIDE",after:"AFTER",footer:"FOOTER"},"WORK"));assert.equal((html.match(/<main/g)||[]).length,1);assert.ok(html.indexOf("WORK")<html.indexOf("ASIDE"));assert.ok(html.indexOf("ASIDE")<html.indexOf("AFTER"));assert.doesNotMatch(render(h(ToolPageLayout,null,"WORK")),/<aside/);assert.match(render(h(ContentPageLayout,{title:"说明"},"正文")),/<h1[^>]*>说明<\/h1>/)
})
