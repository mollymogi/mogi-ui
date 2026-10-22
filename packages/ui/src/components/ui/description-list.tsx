import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

// mogi: 键值列表，渲染为语义化的 dl > div > dt + dd。
// 两列网格：字段名列宽随内容，值列自动换行；compact 收紧行距。
function DescriptionList({
  className,
  compact = false,
  ...props
}: React.ComponentProps<"dl"> & { compact?: boolean }) {
  return (
    <dl
      data-slot="description-list"
      data-compact={compact || undefined}
      className={cn(
        "grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 text-sm",
        compact ? "gap-y-1" : "gap-y-3",
        className
      )}
      {...props}
    />
  )
}

function DescriptionItem({
  className,
  term,
  valueVariant = "default",
  valueClassName,
  children,
  ...props
}: React.ComponentProps<"div"> & { term: React.ReactNode; valueVariant?: "default" | "mono" | "truncate"; valueClassName?: string }) {
  return (
    <div
      data-slot="description-item"
      className={cn("col-span-2 grid grid-cols-subgrid items-baseline", className)}
      {...props}
    >
      <dt data-slot="description-term" className="text-muted-foreground">
        {term}
      </dt>
      <dd data-slot="description-details" data-value-variant={valueVariant} title={valueVariant === "truncate" && (typeof children === "string" || typeof children === "number") ? String(children) : undefined} className={cn("min-w-0 break-words text-foreground", valueVariant === "mono" && "font-mono wrap-anywhere", valueVariant === "truncate" && "truncate", valueClassName)}>
        {children}
      </dd>
    </div>
  )
}

export { DescriptionList, DescriptionItem }
