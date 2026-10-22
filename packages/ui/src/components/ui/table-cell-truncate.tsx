"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { TableCell } from "@mogi-ui/ui/components/table"
import { Button } from "@mogi-ui/ui/components/button"
import { cn } from "@mogi-ui/ui/lib/utils"

type TableCellTruncateProps = Omit<React.ComponentProps<typeof TableCell>, "children"> & {
  value: string | number
  maxChars?: number
  mono?: boolean
  copyable?: boolean
  copyLabel?: string
}

function TableCellTruncate({ value, maxChars = 32, mono = false, copyable = false, copyLabel = "复制完整内容", className, ...props }: TableCellTruncateProps) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "error">("idle")
  const text = String(value)
  React.useEffect(() => { setStatus("idle") }, [text])
  React.useEffect(() => {
    if (status === "idle") return
    const timeout = window.setTimeout(() => setStatus("idle"), 2500)
    return () => window.clearTimeout(timeout)
  }, [status])
  async function copy() {
    try { await navigator.clipboard.writeText(text); setStatus("copied") }
    catch { setStatus("error") }
  }
  const chars = Number.isFinite(maxChars) && maxChars > 0 ? maxChars : 32
  return <TableCell data-slot="table-cell-truncate" className={cn("min-w-0", className)} {...props}>
    <div className="flex min-w-0 items-center gap-2">
      <span title={text} className={cn("block truncate", mono && "font-mono")} style={{ maxWidth: `${chars}ch` }}>{text}</span>
      {copyable && <Button type="button" variant="ghost" size="icon-xs" aria-label={copyLabel} onClick={event => { event.stopPropagation(); void copy() }}>{status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>}
      <span className="sr-only" role="status">{status === "copied" ? "已复制" : status === "error" ? "复制失败，请选择完整内容复制" : ""}</span>
    </div>
  </TableCell>
}

export { TableCellTruncate }
export type { TableCellTruncateProps }
