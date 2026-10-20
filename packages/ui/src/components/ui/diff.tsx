import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"
import { Badge } from "@mogi-ui/ui/components/badge"

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>

// mogi: 统一 diff 视图。接收 unified diff 文本，按 + / - / @@ 着色，
// 不只靠颜色区分（行首本身就是 + / - / 空格）。
function diffLineKind(line: string, beforeFirstHunk: boolean): "hunk" | "add" | "del" | "context" {
  if (line.startsWith("@@")) return "hunk"
  if (beforeFirstHunk && (line.startsWith("+++") || line.startsWith("---"))) return "hunk"
  if (line.startsWith("+")) return "add"
  if (line.startsWith("-")) return "del"
  return "context"
}

const lineClass: Record<ReturnType<typeof diffLineKind>, string> = {
  hunk: "bg-highlight-soft text-highlight",
  add: "bg-success-soft text-success",
  del: "bg-destructive/10 text-destructive",
  context: "text-muted-foreground",
}

function Diff({
  className,
  content,
  label,
  tags,
  actions,
  truncated = false,
  truncatedLabel = "已截断",
  bodyClassName,
  ...props
}: React.ComponentProps<"figure"> & {
  /** unified diff 文本 */
  content: string
  label?: React.ReactNode
  /** 标题栏标签，variant 沿用 Badge 的变体名 */
  tags?: { label: React.ReactNode; variant?: BadgeVariant }[]
  actions?: React.ReactNode
  /** diff 是否被截断，显示提示标签 */
  truncated?: boolean
  truncatedLabel?: React.ReactNode
  /** 内容区类名，默认最大高度 max-h-80，可用它覆盖 */
  bodyClassName?: string
}) {
  const lines = React.useMemo(() => {
    let beforeFirstHunk = true
    return content.split("\n").map((line) => {
      const kind = diffLineKind(line, beforeFirstHunk)
      if (line.startsWith("@@")) beforeFirstHunk = false
      return { line, kind }
    })
  }, [content])
  const hasHeader = label != null || truncated || (tags?.length ?? 0) > 0 || actions != null

  return (
    <figure
      data-slot="diff"
      data-truncated={truncated || undefined}
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <figcaption
          data-slot="diff-header"
          className="flex flex-wrap items-center gap-2 border-b bg-muted/50 px-3 py-2 text-xs"
        >
          {label != null && <span className="font-medium text-foreground">{label}</span>}
          {truncated && <Badge variant="warning">{truncatedLabel}</Badge>}
          {tags?.map((tag, i) => (
            <Badge key={i} variant={tag.variant ?? "soft"}>
              {tag.label}
            </Badge>
          ))}
          {actions != null && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </figcaption>
      )}
      <pre
        data-slot="diff-body"
        // 可滚动区域需要能用键盘聚焦
        tabIndex={0}
        className={cn(
          "max-h-80 overflow-auto py-1 font-mono text-xs leading-relaxed whitespace-pre text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
          bodyClassName
        )}
      >
        {/* mogi: 所有行共享最长行的宽度，横向滚动时背景仍覆盖整行。 */}
        <code data-slot="diff-lines" className="block w-max min-w-full">
          {lines.map(({ line, kind }, i) => {
            return (
              <span
                key={i}
                data-slot="diff-line"
                data-line={kind}
                className={cn("block px-3", lineClass[kind])}
              >
                {line || " "}
              </span>
            )
          })}
        </code>
      </pre>
    </figure>
  )
}

export { Diff }
