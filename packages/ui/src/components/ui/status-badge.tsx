import * as React from "react"
import { CircleHelp, type LucideIcon } from "lucide-react"
import { Badge } from "@mogi-ui/ui/components/badge"

type StatusEntry = { label: React.ReactNode; icon?: LucideIcon; variant?: React.ComponentProps<typeof Badge>["variant"] }
type StatusMap<T extends string = string> = Readonly<Partial<Record<T, StatusEntry>>>
type StatusBadgeProps<T extends string = string> = Omit<React.ComponentProps<typeof Badge>, "children" | "variant" | "asChild"> & {
  value: string | null | undefined
  map: StatusMap<T>
  unknownLabel?: React.ReactNode
}

function StatusBadge<T extends string = string>({ value, map, unknownLabel = "未识别", ...props }: StatusBadgeProps<T>) {
  const entries: Readonly<Partial<Record<string, StatusEntry>>> = map
  const entry = value != null && Object.hasOwn(entries, value) ? entries[value] : undefined
  const Icon = entry?.icon ?? CircleHelp
  return <Badge data-slot="status-badge" variant={entry?.variant ?? "secondary"} {...props}><Icon aria-hidden="true" />{entry?.label ?? unknownLabel}</Badge>
}

export { StatusBadge }
export type { StatusEntry, StatusMap, StatusBadgeProps }
