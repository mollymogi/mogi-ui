import {useState} from "react"
import {WorkflowSteps, type WorkflowStep} from "@mogi-ui/ui/components/workflow-steps"
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@mogi-ui/ui/components/card"
import {Button} from "@mogi-ui/ui/components/button"

const steps: WorkflowStep[] = [
  {id: "plan", label: "分工", state: "completed", meta: "当前对话"},
  {id: "implement", label: "实现", state: "completed", meta: "Codex · 请求模型 A"},
  {id: "review", label: "评审", state: "blocked", description: "等待负责人核对结果", meta: "Grok · 请求模型 B"},
  {id: "accept", label: "验收", state: "pending"},
]
export function WorkflowStepsDemo() {
  const [selected, setSelected] = useState("review")
  const [vertical, setVertical] = useState(false)
  return <div className="grid gap-6">
    <header><p className="text-sm text-muted-foreground">WorkflowSteps</p><h1 className="mt-2 text-2xl font-semibold">流程节点与真实状态</h1><p className="mt-2 text-sm text-muted-foreground">状态完全由调用方提供，不自动推进，也不把未知状态解释为成功。</p></header>
    <Card><CardHeader><CardTitle>协作流程</CardTitle><CardDescription>用 Tab 聚焦节点，Enter 或空格选择。选择不改变完成状态。</CardDescription></CardHeader><CardContent className="grid gap-4"><WorkflowSteps steps={steps} orientation={vertical ? "vertical" : "horizontal"} selectedStepId={selected} onStepSelect={setSelected} /><p className="text-sm text-muted-foreground">已选择：{steps.find(step => step.id === selected)?.label}</p><Button variant="outline" onClick={() => setVertical(value => !value)}>{vertical ? "横向布局" : "纵向布局"}</Button></CardContent></Card>
    <Card><CardHeader><CardTitle>完整状态集合</CardTitle></CardHeader><CardContent><WorkflowSteps aria-label="完整状态示例" orientation="vertical" steps={["pending", "running", "completed", "blocked", "failed", "skipped", "unknown"].map(state => ({id: state, label: state, state: state as WorkflowStep["state"], description: state === "unknown" ? "尚无验证材料" : undefined}))} /></CardContent></Card>
  </div>
}
