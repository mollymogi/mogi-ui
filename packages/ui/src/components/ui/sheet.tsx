"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

// mogi: Side panels share Dialog's focus trap, Escape handling and focus restoration.
function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="sheet-overlay" className={cn(
    "fixed inset-0 z-50 bg-foreground/30 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
    className,
  )} {...props} />
}

const sheetSides = {
  right: "inset-y-0 right-0 h-dvh w-full border-l sm:max-w-md data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left: "inset-y-0 left-0 h-dvh w-full border-r sm:max-w-md data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  top: "inset-x-0 top-0 max-h-dvh w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom: "inset-x-0 bottom-0 max-h-dvh w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
}

function SheetContent({
  className, children, side = "right", showCloseButton = true, closeLabel = "Close", container, ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: keyof typeof sheetSides
  showCloseButton?: boolean
  closeLabel?: string
  container?: React.ComponentProps<typeof DialogPrimitive.Portal>["container"]
}) {
  return <SheetPortal container={container}>
    <SheetOverlay />
    <DialogPrimitive.Content data-slot="sheet-content" data-side={side} className={cn(
      "fixed z-50 flex min-h-0 flex-col overflow-hidden bg-background text-foreground shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out motion-reduce:animate-none",
      sheetSides[side], className,
    )} {...props}>
      {children}
      {showCloseButton && <DialogPrimitive.Close data-slot="sheet-close" aria-label={closeLabel} className="absolute top-4 right-4 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none">
        <XIcon className="size-4" aria-hidden="true" />
      </DialogPrimitive.Close>}
    </DialogPrimitive.Content>
  </SheetPortal>
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex shrink-0 flex-col gap-2 p-6 pr-12", className)} {...props} />
}

// mogi: The body owns scrolling so long forms and wide tables do not push away the footer.
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto p-6", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("flex shrink-0 flex-col-reverse gap-2 border-t p-6 sm:flex-row sm:justify-end", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={cn("text-lg leading-none font-semibold", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription }
