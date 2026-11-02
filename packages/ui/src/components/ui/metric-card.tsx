import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { AnimatedNumber } from "@mogi-ui/ui/components/animated-number"
import { Card } from "@mogi-ui/ui/components/card"
import { cn } from "@mogi-ui/ui/lib/utils"

const metricTones = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning-foreground dark:text-warning",
  destructive: "text-destructive",
  info: "text-info",
}

type MetricCardProps = Omit<React.ComponentProps<typeof Card>, "children"> & {
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  hint?: React.ReactNode
  icon?: LucideIcon
  tone?: keyof typeof metricTones
  animated?: boolean
  /** quiet 用于背景数字，不和需要处理的指标抢注意力 */
  emphasis?: "default" | "quiet"
  density?: "default" | "compact"
}

function MetricCard({ label, value, unit, hint, icon: Icon, tone = "default", animated = false, emphasis = "default", density = "default", className, ...props }: MetricCardProps) {
  return <Card data-slot="metric-card" data-tone={tone} data-emphasis={emphasis} className={cn("min-w-0 gap-3 px-5 py-5", density === "compact" && "gap-1 px-4 py-3", className)} {...props}>
    <dl className="min-w-0">
      <dt className="flex items-center justify-between gap-3 text-sm text-muted-foreground">{label}{Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}</dt>
      <dd className={cn("mt-3 flex flex-wrap items-baseline gap-2 wrap-anywhere font-mono text-3xl font-semibold tabular-nums", density === "compact" && "mt-1", emphasis === "quiet" && "text-xl font-medium", metricTones[tone])}>{animated && typeof value === "number" && Number.isFinite(value) ? <AnimatedNumber value={value} /> : value}{unit != null && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}</dd>
    </dl>
    {hint != null && <p className="text-xs text-muted-foreground">{hint}</p>}
  </Card>
}

export { MetricCard }
export type { MetricCardProps }
