"use client"

import * as React from "react"
import { TableCell } from "@mogi-ui/ui/components/table"
import { CopyButton } from "@mogi-ui/ui/components/copy-button"
import { cn } from "@mogi-ui/ui/lib/utils"

type TableCellTruncateProps = Omit<React.ComponentProps<typeof TableCell>, "children"> & {
  value: string | number
  maxChars?: number
  mono?: boolean
  copyable?: boolean
  copyLabel?: string
  animated?: boolean
}

function TableCellTruncate({ value, maxChars = 32, mono = false, copyable = false, copyLabel = "复制完整内容", animated = true, className, ...props }: TableCellTruncateProps) {
  const text = String(value)
  const chars = Number.isFinite(maxChars) && maxChars > 0 ? maxChars : 32
  return <TableCell data-slot="table-cell-truncate" className={cn("min-w-0", className)} {...props}>
    <div className="flex min-w-0 items-center gap-2">
      <span title={text} className={cn("block truncate", mono && "font-mono")} style={{ maxWidth: `${chars}ch` }}>{text}</span>
      {copyable && <CopyButton value={text} label={copyLabel} animated={animated} />}
    </div>

  </TableCell>
}

export { TableCellTruncate }
export type { TableCellTruncateProps }
