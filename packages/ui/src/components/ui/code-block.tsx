"use client"

import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"
import { highlightCode, syntaxToneClass } from "@mogi-ui/ui/components/code-highlighter"
import { Badge } from "@mogi-ui/ui/components/badge"

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>

// mogi: 原始 JSON / 文本块。标题栏放标签和操作，内容区限高滚动。
// masked 时自动加"已遮罩"标签和左侧 warning 色条，不只靠颜色区分。
// numbered 时在内容左侧渲染行号（仅对纯文本 children 生效；行号不可选中，复制不含行号）。
function CodeBlock({
  className,
  label,
  tags,
  actions,
  masked = false,
  maskedLabel = "已遮罩",
  language,
  fileName,
  numbered = false,
  startLine = 1,
  bodyClassName,
  children,
  ...props
}: React.ComponentProps<"figure"> & {
  label?: React.ReactNode
  /** 标题栏标签，variant 沿用 Badge 的变体名 */
  tags?: { label: React.ReactNode; variant?: BadgeVariant }[]
  actions?: React.ReactNode
  masked?: boolean
  maskedLabel?: React.ReactNode
  /** 语法高亮；未知语言回退为纯文本，显式语言优先于文件名。 */
  language?: string
  /** 未指定 language 时按文件名识别。 */
  fileName?: string
  /** 显示行号；children 为字符串时生效 */
  numbered?: boolean
  /** 起始行号，默认 1 */
  startLine?: number
  /** 内容区类名，默认最大高度 max-h-80，可用它覆盖 */
  bodyClassName?: string
}) {
  const hasHeader = label != null || masked || (tags?.length ?? 0) > 0 || actions != null
  const lines = React.useMemo(() => typeof children === "string" && (numbered || language != null || fileName != null) ? highlightCode(children, language, fileName) : null, [children, numbered, language, fileName])

  return (
    <figure
      data-slot="code-block"
      data-masked={masked || undefined}
      data-numbered={numbered || undefined}
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-lg border bg-card text-card-foreground",
        masked && "shadow-[inset_3px_0_0_var(--warning)]",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <figcaption
          data-slot="code-block-header"
          className="flex flex-wrap items-center gap-2 border-b bg-muted/50 px-3 py-2 text-xs"
        >
          {label != null && <span className="font-medium text-foreground">{label}</span>}
          {masked && <Badge variant="warning">{maskedLabel}</Badge>}
          {tags?.map((tag, i) => (
            <Badge key={i} variant={tag.variant ?? "soft"}>
              {tag.label}
            </Badge>
          ))}
          {actions != null && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </figcaption>
      )}
      <pre
        data-slot="code-block-body"
        // 可滚动区域需要能用键盘聚焦
        onCopy={event => {
          const selection = event.currentTarget.ownerDocument.getSelection()
          if (!selection || selection.isCollapsed) return
          const holder = event.currentTarget.ownerDocument.createElement("div")
          for (let i = 0; i < selection.rangeCount; i++) holder.append(selection.getRangeAt(i).cloneContents())
          holder.querySelectorAll('[data-slot="code-block-line-number"]').forEach(node => node.remove())
          event.clipboardData.setData("text/plain", holder.textContent ?? "")
          event.preventDefault()
        }}
        tabIndex={0}
        className={cn(
          "max-h-80 overflow-auto p-3 font-mono text-xs leading-relaxed whitespace-pre text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
          bodyClassName
        )}
      >
        {lines ? (
          <code data-slot="code-block-lines" className="block min-w-max">
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                <span data-slot="code-block-line" className={cn("relative block min-h-[1lh]", numbered && "pl-10")}>
                  {numbered && <span
                    data-slot="code-block-line-number"
                    aria-hidden="true"
                    className="absolute left-0 w-10 select-none pr-3 text-right text-muted-foreground"
                  >{startLine + i}</span>}
                  <span data-slot="code-block-line-content">{line.segments.map((segment, j) => <span key={j} data-token={segment.tone} className={syntaxToneClass[segment.tone]}>{segment.text}</span>)}</span>{line.ending}
                </span>
              </React.Fragment>
            ))}
          </code>
        ) : (
          children
        )}
      </pre>
    </figure>
  )
}

export { CodeBlock }
