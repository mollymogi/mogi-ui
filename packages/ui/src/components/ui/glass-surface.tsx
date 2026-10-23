import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@mogi-ui/ui/lib/utils"

function GlassSurface({ asChild = false, enabled = true, className, ...props }: React.ComponentProps<"div"> & { asChild?: boolean; enabled?: boolean }) {
  const Component = asChild ? Slot.Root : "div"
  return <Component {...(!asChild && { "data-slot": "glass-surface" })} data-glass={enabled} className={cn(
    "border bg-card text-card-foreground",
    enabled && "dark:border-[var(--glass-border)] dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08),0_16px_48px_rgb(0_0_0_/_0.14)] dark:supports-[backdrop-filter:blur(1px)]:bg-[var(--glass-tint)] dark:supports-[backdrop-filter:blur(1px)]:backdrop-blur-2xl dark:[@media(prefers-reduced-transparency:reduce)]:bg-card! dark:[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none!",
    className,
  )} {...props} />
}

export { GlassSurface }
