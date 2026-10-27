import {useState} from 'react'
import {applyNodeChanges,type Node,type NodeChange,type NodeProps} from '@xyflow/react'
import {FlowCanvas,FlowCanvasNode} from '@mogi-ui/ui/components/flow-canvas'
import {Button} from '@mogi-ui/ui/components/button'
type DemoNode=Node<{title:string;detail:string},'sample'>
const initial:DemoNode[]=[{id:'run',type:'sample',position:{x:0,y:120},data:{title:'运行',detail:'状态与关系由调用方提供'}},{id:'worker',type:'sample',position:{x:340,y:0},data:{title:'实现成员',detail:'拖动节点只改变布局'}},{id:'reviewer',type:'sample',position:{x:340,y:240},data:{title:'评审成员',detail:'不自动推断前置任务或成功'}}]
function Sample({data,selected}:NodeProps<DemoNode>){return <FlowCanvasNode selected={selected} className="w-60"><h2 className="text-sm font-semibold">{data.title}</h2><p className="mt-2 text-xs text-muted-foreground">{data.detail}</p></FlowCanvasNode>}
const nodeTypes={sample:Sample}
export function FlowCanvasDemo({dark,onThemeChange}:{dark:boolean;onThemeChange:()=>void}){
  const [nodes,setNodes]=useState(initial)
  return <main className="mx-auto max-w-6xl space-y-5 p-4 sm:p-8"><header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-muted-foreground">FlowCanvas / React Flow</p><h1 className="mt-2 text-2xl font-semibold">无限画布与节点</h1><p className="mt-2 text-sm text-muted-foreground">静态示例。拖动平移、Ctrl/⌘ + 滚轮缩放，Tab 选择控制；位置在本页保留。</p></div><Button variant="outline" onClick={onThemeChange}>{dark?'亮色主题':'暗色主题'}</Button></header><FlowCanvas<DemoNode> nodes={nodes} onNodesChange={(changes:NodeChange<DemoNode>[])=>setNodes(n=>applyNodeChanges(changes,n))} edges={[{id:'a',source:'run',target:'worker'},{id:'b',source:'run',target:'reviewer'}]} nodeTypes={nodeTypes} label="流程画布示例"/><Button variant="outline" onClick={()=>setNodes(initial)}>重置节点位置</Button></main>
}
