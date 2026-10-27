"use client"

import * as React from "react"
import { Check, Circle, CircleHelp, CircleX, LoaderCircle, PauseCircle, SkipForward } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

type WorkflowStepState = "pending" | "running" | "completed" | "blocked" | "failed" | "skipped" | "unknown"
type WorkflowStep = {
  id: string
  label: React.ReactNode
  state: WorkflowStepState
  description?: React.ReactNode
  meta?: React.ReactNode
  disabled?: boolean
}
type WorkflowStepsProps = Omit<React.ComponentProps<"ol">, "children" | "onSelect"> & {
  steps: WorkflowStep[]
  orientation?: "horizontal" | "vertical"
  selectedStepId?: string
  onStepSelect?: (id: string) => void
  stateLabels?: Partial<Record<WorkflowStepState, string>>
}

const states = {
  pending: { label: "等待", icon: Circle, tone: "text-muted-foreground" },
  running: { label: "进行中", icon: LoaderCircle, tone: "text-link" },
  completed: { label: "已完成", icon: Check, tone: "text-success" },
  blocked: { label: "受阻", icon: PauseCircle, tone: "text-warning-foreground dark:text-warning" },
  failed: { label: "失败", icon: CircleX, tone: "text-destructive" },
  skipped: { label: "已跳过", icon: SkipForward, tone: "text-muted-foreground" },
  unknown: { label: "未知", icon: CircleHelp, tone: "text-muted-foreground" },
} as const

// State belongs to the caller: completion never advances neighboring steps.
function WorkflowSteps({ steps, orientation = "horizontal", selectedStepId, onStepSelect, stateLabels, className, ...props }: WorkflowStepsProps) {
  return <ol aria-label="工作流程" {...props} data-slot="workflow-steps" data-orientation={orientation}
    className={cn("m-0 flex min-w-0 list-none gap-3 p-0", orientation === "horizontal" ? "flex-col sm:flex-row sm:flex-wrap" : "flex-col", className)}>
    {steps.map(step => {
      const state = Object.hasOwn(states, step.state) ? step.state : "unknown"
      const info = states[state]
      const Icon = info.icon
      const label = stateLabels?.[state] ?? info.label
      const content = <>
        <span aria-hidden="true" className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border bg-background", info.tone)}>
          <Icon className={cn("size-4", state === "running" && "animate-spin motion-reduce:animate-none")} />
        </span>
        <span className="grid min-w-0 flex-1 gap-1 text-left">
          <span className="text-sm font-medium wrap-anywhere">{step.label}</span>
          <span className={cn("text-xs", state === "running" ? "text-accent-foreground" : info.tone)}>{label}</span>
          {step.description != null && <span className="text-xs text-muted-foreground wrap-anywhere">{step.description}</span>}
          {step.meta != null && <span className="text-xs text-muted-foreground wrap-anywhere">{step.meta}</span>}
        </span>
      </>
      return <li key={step.id} data-slot="workflow-step" data-state={state} aria-current={state === "running" ? "step" : undefined}
        className={cn("relative min-w-0", orientation === "horizontal" && "sm:flex-1 sm:basis-40")}>
        {onStepSelect
          ? <button type="button" disabled={step.disabled} aria-pressed={selectedStepId === step.id} onClick={() => onStepSelect(step.id)}
              className={cn("flex h-full w-full min-w-0 items-start gap-3 rounded-lg border border-border-strong bg-card p-3 text-card-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50", selectedStepId === step.id && "border-primary bg-accent")}>{content}</button>
          : <div className="flex min-w-0 items-start gap-3 rounded-lg border bg-card p-3 text-card-foreground">{content}</div>}
      </li>
    })}
  </ol>
}

export { WorkflowSteps }
export type { WorkflowStep, WorkflowStepState, WorkflowStepsProps }
