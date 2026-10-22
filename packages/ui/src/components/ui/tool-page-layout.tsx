import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

type ToolPageLayoutProps = React.ComponentProps<"div"> & {
  navigation?: React.ReactNode
  hero?: React.ReactNode
  aside?: React.ReactNode
  footer?: React.ReactNode
  after?: React.ReactNode
}
// mogi: Slot-only public tool page; no business logic, scripts, brand, or service credentials.
function ToolPageLayout({navigation, hero, aside, footer, after, children, className, ...props}: ToolPageLayoutProps) {
  return <div {...props} data-slot="tool-page-layout" className={cn("min-h-dvh min-w-0 bg-background text-foreground", className)}>
    {navigation != null && <header className="border-b"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-8">{navigation}</div></header>}
    <main className="mx-auto grid max-w-7xl min-w-0 gap-8 px-4 py-10 sm:px-8">
      {hero != null && <div data-slot="tool-page-hero" className="min-w-0">{hero}</div>}
      <div className={cn("grid min-w-0 items-start gap-6", aside != null && "lg:grid-cols-3")}>
        <div data-slot="tool-page-main" className={cn("grid min-w-0 gap-6", aside != null && "lg:col-span-2")}>{children}</div>
        {aside != null && <aside data-slot="tool-page-aside" className="grid min-w-0 gap-4">{aside}</aside>}
      </div>{after}
    </main>
    {footer != null && <footer className="border-t"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">{footer}</div></footer>}
  </div>
}
type ContentPageLayoutProps = React.ComponentProps<"div"> & {
  navigation?: React.ReactNode
  eyebrow?: React.ReactNode
  title: string
  description?: React.ReactNode
  footer?: React.ReactNode
}
function ContentPageLayout({navigation, eyebrow, title, description, footer, children, className, ...props}: ContentPageLayoutProps) {
  return <div {...props} data-slot="content-page-layout" className={cn("min-h-dvh min-w-0 bg-background text-foreground", className)}>
    {navigation != null && <header className="border-b"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-8">{navigation}</div></header>}
    <main className="mx-auto grid w-full max-w-3xl min-w-0 gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <header className="grid gap-4">{eyebrow != null && <div className="text-sm text-muted-foreground">{eyebrow}</div>}
        <h1 className="text-3xl font-bold text-balance sm:text-4xl">{title}</h1>
        {description != null && <div className="text-lg text-muted-foreground">{description}</div>}
      </header><div data-slot="content-page-body" className="grid min-w-0 gap-6 text-base leading-relaxed wrap-anywhere">{children}</div>
    </main>
    {footer != null && <footer className="border-t"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">{footer}</div></footer>}
  </div>
}
export { ToolPageLayout, ContentPageLayout }
export type { ToolPageLayoutProps, ContentPageLayoutProps }
