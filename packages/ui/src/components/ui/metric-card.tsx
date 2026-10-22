import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@mogi-ui/ui/components/card"
import { cn } from "@mogi-ui/ui/lib/utils"

const metricTones = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning-foreground dark:text-warning",
  destructive: "text-destructive",
}

type MetricCardProps = Omit<React.ComponentProps<typeof Card>, "children"> & {
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  hint?: React.ReactNode
  icon?: LucideIcon
  tone?: keyof typeof metricTones
}

function MetricCard({ label, value, unit, hint, icon: Icon, tone = "default", className, ...props }: MetricCardProps) {
  return <Card data-slot="metric-card" data-tone={tone} className={cn("min-w-0 gap-3 px-5 py-5", className)} {...props}>
    <dl className="min-w-0">
      <dt className="flex items-center justify-between gap-3 text-sm text-muted-foreground">{label}{Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}</dt>
      <dd className={cn("mt-3 flex flex-wrap items-baseline gap-2 wrap-anywhere font-mono text-3xl font-semibold tabular-nums", metricTones[tone])}>{value}{unit != null && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}</dd>
    </dl>
    {hint != null && <p className="text-xs text-muted-foreground">{hint}</p>}
  </Card>
}

export { MetricCard }
export type { MetricCardProps }
