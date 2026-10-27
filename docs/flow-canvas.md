# FlowCanvas

A read-only relationship canvas for workflow monitors, task maps, and node-based views. Built on React Flow with Mogi semantic tokens, keyboard node movement, a minimap, and accessible zoom controls. It does not infer workflow state or create edges.

```bash
npx shadcn@latest add https://mollymogi.github.io/mogi-ui/r/flow-canvas.json
```

```tsx
import { useState } from "react"
import { applyNodeChanges, type Node, type NodeChange, type NodeProps } from "@xyflow/react"
import { FlowCanvas, FlowCanvasNode } from "@/components/ui/flow-canvas"

type MemberNode = Node<{ label: string }, "member">
const nodeTypes = {
  member: ({ data }: NodeProps<MemberNode>) => <FlowCanvasNode>{data.label}</FlowCanvasNode>,
}

export function Members() {
  const [nodes, setNodes] = useState<MemberNode[]>([
    { id: "member", type: "member", position: { x: 0, y: 0 }, data: { label: "Implementation" } },
  ])
  const onNodesChange = (changes: NodeChange<MemberNode>[]) =>
    setNodes(previous => applyNodeChanges(changes, previous))

  return <FlowCanvas<MemberNode> label="Team members" nodes={nodes} edges={[]}
    nodeTypes={nodeTypes} onNodesChange={onNodesChange} className="h-[40rem]" />
}
```

The component imports React Flow's stylesheet. The default height is 38rem; set an explicit height for the desired surface. `FlowCanvasNode` has left/right handles (`ports="source" | "target" | "both" | "none"`); connections, reconnections, and Delete-key removal are disabled.

`nodes`, `edges`, and `onNodesChange` remain controlled by the caller. Define `nodeTypes` outside the render function. Without `onNodesChange`, nodes are not draggable by default. Put `nodrag nopan` on interactive child controls. Persist positions on `onNodeDragStop`; use `defaultViewport`, `fitView={false}` and `onMoveEnd` to restore a saved viewport. Preserve node position and measured dimensions when merging fresh data from a polling source, rather than recreating all node geometry.

Drag empty space to pan. Use Ctrl/⌘ + wheel, pinch, or the zoom buttons; ordinary scrolling continues the surrounding page. The 100% button resets scale and the fit button reveals all nodes. Keyboard-focused nodes can be moved with arrow keys. A Chinese description is provided by default; callers may customize React Flow's `ariaLabelConfig` and canvas `label`.

`toolbar` adds caller content at top-left. `miniMap={false}` hides the minimap; by default it is visible from the medium breakpoint. Layout, status, models, task details, and persistence are application concerns. No conversation data is collected by this component.

Preview: `apps/docs` at `?preview=flow-canvas`. Test: `node --test scripts/flow-canvas.test.mjs`.

Upstream engine: [React Flow documentation](https://reactflow.dev/learn), MIT license.
