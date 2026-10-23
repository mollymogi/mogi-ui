"use client"

import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

function Checkbox({
  className, checked, defaultChecked = false, onCheckedChange, animated = true, ref,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & { animated?: boolean }) {
  const [internal, setInternal] = React.useState<typeof defaultChecked>(defaultChecked)
  const value = checked ?? internal
  const previous = React.useRef(value)
  const root = React.useRef<HTMLButtonElement>(null)
  React.useLayoutEffect(() => {
    const changed = previous.current !== value
    previous.current = value
    if (!changed || !value || !animated || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animations = Array.from(root.current?.querySelectorAll<SVGGeometryElement>("svg path, svg polyline, svg line") ?? []).map(stroke => {
      stroke.setAttribute("pathLength", "1")
      return stroke.animate([{ strokeDasharray: "1", strokeDashoffset: "1" }, { strokeDasharray: "1", strokeDashoffset: "0" }], { duration: 180, easing: "ease-out" })
    })
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => animations.forEach(animation => animation.cancel())
    preference.addEventListener("change", stop)
    return () => { stop(); preference.removeEventListener("change", stop) }
  }, [value, animated])
  return (
    <CheckboxPrimitive.Root
      ref={node => { root.current = node; if (typeof ref === "function") return ref(node); else if (ref) ref.current = node }}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={next => { if (checked === undefined) setInternal(next); onCheckedChange?.(next) }}
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-[background-color,border-color,box-shadow] duration-(--duration-mogi-fast) ease-mogi outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-primary",
        !animated && "transition-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        {value === "indeterminate" ? <MinusIcon aria-hidden="true" className="size-3.5" /> : <CheckIcon aria-hidden="true" className="size-3.5" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
