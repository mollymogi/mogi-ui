"use client"

import * as React from "react"
import {Background, BackgroundVariant, Handle, MiniMap, Panel, Position, ReactFlow, ReactFlowProvider, useReactFlow, useViewport, type Edge, type Node, type ReactFlowProps} from "@xyflow/react"
import {Maximize2, Minus, Plus} from "lucide-react"
import {Button} from "@mogi-ui/ui/components/button"
import {cn} from "@mogi-ui/ui/lib/utils"
import "@xyflow/react/dist/style.css"

type FlowCanvasProps<N extends Node = Node, E extends Edge = Edge> = Omit<ReactFlowProps<N,E>, "children" | "onConnect" | "onReconnect" | "nodesConnectable" | "edgesReconnectable" | "deleteKeyCode"> & {
  label?: string
  className?: string
  toolbar?: React.ReactNode
  miniMap?: boolean
}

const semanticStyle = {
  "--xy-background-color": "var(--background)",
  "--xy-node-background-color-default": "var(--card)",
  "--xy-node-color-default": "var(--card-foreground)",
  "--xy-node-border-default": "1px solid var(--border-strong)",
  "--xy-node-boxshadow-selected-default": "0 0 0 2px var(--ring)",
  "--xy-edge-stroke-default": "var(--border-strong)",
  "--xy-edge-stroke-selected-default": "var(--primary)",
  "--xy-handle-background-color-default": "var(--background)",
  "--xy-handle-border-color-default": "var(--border-strong)",
  "--xy-attribution-background-color-default": "var(--card)",
} as React.CSSProperties

function FlowCanvasSurface<N extends Node = Node, E extends Edge = Edge>({label = "关系画布", className, toolbar, miniMap = true, ...props}:FlowCanvasProps<N,E>){
  const flow=useReactFlow<N,E>()
  const viewport=useViewport()
  const description=React.useId()
  return <div data-slot="flow-canvas" role="region" aria-label={label} aria-describedby={description} className={cn("relative h-[38rem] min-h-80 overflow-hidden rounded-xl border bg-background text-foreground",className)}>
    <p id={description} className="sr-only">拖动画布平移，使用加减按钮缩放。聚焦节点后可以用方向键整理位置；通过节点内的按钮查看详情。连线只读，不支持新增连接或删除节点。</p>
    <ReactFlow<N,E> {...props} style={{...semanticStyle,...props.style}} colorMode={props.colorMode??"light"}
      nodesDraggable={props.nodesDraggable??Boolean(props.onNodesChange)} nodesConnectable={false} edgesReconnectable={false} deleteKeyCode={null}
      zoomOnScroll={false} zoomActivationKeyCode={["Meta","Control"]} preventScrolling={false}
      minZoom={props.minZoom??0.25} maxZoom={props.maxZoom??2.5} fitView={props.fitView??true} fitViewOptions={props.fitViewOptions??{padding:0.15,maxZoom:1}}
      ariaLabelConfig={{"node.a11yDescription.default":"用方向键移动节点，Tab 可聚焦节点中的详情按钮。","edge.a11yDescription.default":"只读关系连线。","minimap.ariaLabel":"流程缩略图",...props.ariaLabelConfig}}>
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border-strong)" bgColor="var(--background)"/>
      {toolbar&&<Panel position="top-left" className="max-w-[calc(100%-2rem)]">{toolbar}</Panel>}
      <Panel position="bottom-left"><div className="flex items-center gap-1 rounded-lg border border-border-strong bg-card p-1 shadow-sm">
        <Button type="button" size="icon" variant="ghost" aria-label="放大画布" onClick={()=>void flow.zoomIn({duration:0})}><Plus/></Button>
        <Button type="button" size="icon" variant="ghost" aria-label="缩小画布" onClick={()=>void flow.zoomOut({duration:0})}><Minus/></Button>
        <Button type="button" size="sm" variant="ghost" aria-label="恢复画布 100% 缩放" onClick={()=>void flow.zoomTo(1,{duration:0})} className="min-w-16 font-mono text-xs">{Math.round(viewport.zoom*100)}%</Button>
        <Button type="button" size="icon" variant="ghost" aria-label="适应全部节点" onClick={()=>void flow.fitView({padding:0.15,maxZoom:1,duration:0})}><Maximize2/></Button>
      </div></Panel>
      {miniMap&&<MiniMap pannable zoomable className="hidden overflow-hidden rounded-lg border border-border-strong shadow-sm md:block" nodeColor="var(--muted)" nodeStrokeColor="var(--border-strong)" bgColor="var(--card)" maskColor="color-mix(in srgb, var(--background) 75%, transparent)"/>}
    </ReactFlow>
  </div>
}

function FlowCanvas<N extends Node = Node,E extends Edge = Edge>(props:FlowCanvasProps<N,E>){
  return <ReactFlowProvider initialNodes={props.nodes} initialEdges={props.edges} defaultNodes={props.defaultNodes} defaultEdges={props.defaultEdges}><FlowCanvasSurface {...props}/></ReactFlowProvider>
}

function FlowCanvasNode({children,selected=false,ports="both",className,...props}:React.ComponentProps<"div">&{selected?:boolean;ports?:"source"|"target"|"both"|"none"}){
  return <div data-slot="flow-canvas-node" data-selected={selected||undefined} className={cn("rounded-xl border border-border-strong bg-card p-4 text-card-foreground shadow-sm",selected&&"outline-2 outline-offset-2 outline-ring",className)} {...props}>
    {(ports==="both"||ports==="target")&&<Handle type="target" position={Position.Left} isConnectable={false} className="pointer-events-none"/>}
    {children}
    {(ports==="both"||ports==="source")&&<Handle type="source" position={Position.Right} isConnectable={false} className="pointer-events-none"/>}
  </div>
}

export {FlowCanvas,FlowCanvasNode}
export type {FlowCanvasProps}
