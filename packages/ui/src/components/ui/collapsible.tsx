"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cn } from "@mogi-ui/ui/lib/utils"

const CollapsibleContext = React.createContext({ open: false, animated: true })

function Collapsible({ open, defaultOpen = false, onOpenChange, animated = true, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root> & { animated?: boolean }) {
  const [internal, setInternal] = React.useState(defaultOpen)
  const expanded = open ?? internal
  return <CollapsibleContext.Provider value={{ open: expanded, animated }}><CollapsiblePrimitive.Root {...props} data-slot="collapsible" open={expanded} onOpenChange={next => { if (open === undefined) setInternal(next); onOpenChange?.(next) }} /></CollapsibleContext.Provider>
}

function CollapsibleTrigger({ className, children, asChild, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  const { animated } = React.useContext(CollapsibleContext)
  return <CollapsiblePrimitive.Trigger {...props} asChild={asChild} data-slot="collapsible-trigger" className={cn("group/collapsible flex w-full items-center justify-between gap-3 rounded-md text-left text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", className)}>
    {asChild ? children : <>{children}<ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none", !animated && "transition-none")} /></>}
  </CollapsiblePrimitive.Trigger>
}

/** Keeps content mounted to retain form state; collapsed content is inert and hidden from AT. */
function CollapsibleContent({ className, children, ...props }: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Content>, "forceMount" | "asChild">) {
  const { open, animated } = React.useContext(CollapsibleContext)
  return <CollapsiblePrimitive.Content {...props} forceMount data-slot="collapsible-content" aria-hidden={!open} inert={!open}>
    <div data-slot="collapsible-motion" data-state={open ? "open" : "closed"} className={cn("grid grid-rows-[0fr] transition-[grid-template-rows,opacity] duration-200 ease-mogi data-[state=open]:grid-rows-[1fr] data-[state=closed]:opacity-0 motion-reduce:transition-none", !animated && "transition-none", className)}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  </CollapsiblePrimitive.Content>
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
