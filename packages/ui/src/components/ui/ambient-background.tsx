import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

function AmbientBackground({ enabled = true, className, style, ...props }: React.ComponentProps<"div"> & { enabled?: boolean }) {
  return <div data-slot="ambient-background" data-enabled={enabled} className={cn("min-h-svh bg-background", className)} style={{
    backgroundImage: enabled ? "radial-gradient(ellipse at 10% 0%, var(--ambient-middle), transparent 65%), radial-gradient(ellipse at 100% 65%, var(--ambient-end), transparent 60%), linear-gradient(145deg, var(--ambient-start), var(--ambient-middle) 48%, var(--ambient-end))" : undefined,
    ...style,
  }} {...props} />
}

export { AmbientBackground }
