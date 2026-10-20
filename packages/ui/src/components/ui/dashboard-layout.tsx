import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

type DashboardLayoutProps = React.ComponentProps<"div"> & {
  navigation: React.ReactNode
  header?: React.ReactNode
  aside?: React.ReactNode
}

/** Workspace shell. Navigation, data, and responsive menu state belong to the caller. */
function DashboardLayout({ navigation, header, aside, children, className, ...props }: DashboardLayoutProps) {
  const hasAside = aside != null && aside !== false
  return (
    <div data-slot="dashboard-layout" className={cn("min-h-dvh min-w-0 bg-background text-foreground lg:grid lg:grid-cols-[224px_minmax(0,1fr)]", className)} {...props}>
      <div data-slot="dashboard-layout-navigation" className="min-w-0 border-b bg-sidebar text-sidebar-foreground lg:border-r lg:border-b-0">{navigation}</div>
      <div className="min-w-0">
        {header != null && <div data-slot="dashboard-layout-header" className="min-w-0 border-b">{header}</div>}
        <div className={cn("grid min-w-0 grid-cols-1 items-start gap-8 p-5 sm:p-8 xl:p-10", hasAside && "xl:grid-cols-[minmax(0,1fr)_280px]")}>
          <main id="dashboard-main" data-slot="dashboard-layout-main" className="min-w-0 wrap-anywhere">{children}</main>
          {hasAside && <aside data-slot="dashboard-layout-aside" className="min-w-0 wrap-anywhere">{aside}</aside>}
        </div>
      </div>
    </div>
  )
}

export { DashboardLayout }
export type { DashboardLayoutProps }
