"use client"

import * as React from "react"
import { CheckCircle2, CircleX, LoaderCircle, PauseCircle } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"
import { Button } from "@mogi-ui/ui/components/button"

type TaskProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: string
  state?: "running" | "success" | "error" | "cancelled"
  value?: number
  detail?: React.ReactNode
  onCancel?: () => void
  cancelLabel?: string
}
// mogi: Missing/invalid value is indeterminate; status and progress come only from the caller.
function TaskProgress({label, state = "running", value, detail, onCancel, cancelLabel = "取消", className, ...props}: TaskProgressProps) {
  const numeric = value != null && Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : undefined
  const Icon = state === "success" ? CheckCircle2 : state === "error" ? CircleX : state === "cancelled" ? PauseCircle : LoaderCircle
  return <div {...props} data-slot="task-progress" data-state={state} className={cn("grid min-w-0 gap-3 rounded-lg border bg-card p-4 text-card-foreground", className)}>
    <div className="flex min-w-0 items-start justify-between gap-3">
      <div role={state === "error" ? "alert" : "status"} className="flex min-w-0 items-center gap-2 text-sm font-medium wrap-anywhere">
        <Icon aria-hidden className={cn("size-4 shrink-0", state === "error" ? "text-destructive" : state === "success" ? "text-success" : "text-link", state === "running" && "animate-spin motion-reduce:animate-none")} />{label}
      </div>
      {state === "running" && onCancel && <Button type="button" size="sm" variant="outline" onClick={onCancel}>{cancelLabel}</Button>}
    </div>
    {state === "running" && <progress aria-label={label} max={100} value={numeric} className="h-2 w-full min-w-0 accent-link [color-scheme:light] dark:[color-scheme:dark]" />}
    {detail != null && <div className="text-sm text-muted-foreground wrap-anywhere">{detail}</div>}
  </div>
}
export { TaskProgress }
export type { TaskProgressProps }
