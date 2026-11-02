import * as React from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

function LinkList({ className, children, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="link-list" className={cn("min-w-0", className)} {...props}><ul className="grid min-w-0">{children}</ul></nav>
}

type LinkListItemProps = Omit<React.ComponentProps<"a">, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: LucideIcon
  /** 数量或状态，显示在箭头之前 */
  trailing?: React.ReactNode
}

// mogi: 一组同级入口。替代成排的按钮，把强调留给页面的主操作。
function LinkListItem({ title, description, icon: Icon, trailing, className, ...props }: LinkListItemProps) {
  return <li className="min-w-0"><a data-slot="link-list-item" className={cn("flex min-w-0 items-center gap-3 rounded-md px-2 py-2 text-foreground outline-none transition-colors duration-(--duration-mogi-fast) hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring", className)} {...props}>
    {Icon && <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />}
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-medium">{title}</span>
      {description != null && <span className="block text-xs text-muted-foreground">{description}</span>}
    </span>
    {trailing != null && <span className="shrink-0 text-sm text-muted-foreground">{trailing}</span>}
    <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
  </a></li>
}

export { LinkList, LinkListItem }
export type { LinkListItemProps }
