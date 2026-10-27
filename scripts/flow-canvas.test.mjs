import {test} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {createRequire} from 'node:module'
import ts from 'typescript'
const require=createRequire(new URL('../packages/ui/package.json',import.meta.url))
const {createElement:h}=require('react')
const {renderToStaticMarkup:render}=require('react-dom/server')
const cache=new Map()
function load(name){
  if(cache.has(name))return cache.get(name)
  const source=fs.readFileSync(new URL(`../packages/ui/src/${name}`,import.meta.url),'utf8').replace(/^import ["'][^"']+\.css["'];?\s*$/gm,'')
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText
  const exports={}
  new Function('require','exports',output)(specifier=>specifier==='@mogi-ui/ui/lib/utils'?load('lib/utils.ts'):specifier.startsWith('@mogi-ui/ui/components/')?load(`components/ui/${specifier.split('/').at(-1)}.tsx`):require(specifier),exports)
  cache.set(name,exports);return exports
}
const {FlowCanvas}=load('components/ui/flow-canvas.tsx')
test('empty canvas has a named region, accessible instructions and explicit non-submit controls',()=>{
  const html=render(h('form',null,h(FlowCanvas,{nodes:[],edges:[],label:'任务关系图',miniMap:false})))
  assert.match(html,/role="region"/);assert.match(html,/aria-label="任务关系图"/)
  for(const label of ['放大画布','缩小画布','恢复画布 100% 缩放','适应全部节点'])assert.ok(html.includes(label))
  const buttons=html.match(/<button[^>]*>/g)||[];assert.equal(buttons.length,4);assert.ok(buttons.every(b=>b.includes('type="button"')))
  assert.match(html,/连线只读/)
})
test('semantic theme variables and caller toolbar render without invented workflow content',()=>{
  const html=render(h(FlowCanvas,{nodes:[],edges:[],toolbar:h('p',null,'现有关系'),miniMap:false}))
  assert.match(html,/现有关系/);assert.match(html,/var\(--background\)/);assert.match(html,/var\(--card\)/)
  assert.doesNotMatch(html,/已完成任务|业务通过|100% 完成/)
})
test('caller-provided relationships and initial nodes are SSR-safe',()=>{
  const html=render(h(FlowCanvas,{nodes:[{id:'a',position:{x:0,y:0},data:{label:'已有成员'},width:200,height:100}],edges:[],miniMap:false}))
  assert.match(html,/已有成员/);assert.doesNotMatch(html,/<script>/)
})
