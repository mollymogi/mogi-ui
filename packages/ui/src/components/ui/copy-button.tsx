"use client"

import * as React from "react"
import { Check, CircleAlert, Copy, LoaderCircle } from "lucide-react"
import { Button } from "@mogi-ui/ui/components/button"
import { cn } from "@mogi-ui/ui/lib/utils"

type CopyButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick" | "children" | "asChild" | "type"> & {
  value: string
  label?: string
  animated?: boolean
}

function CopyButton({ value, label = "复制完整内容", animated = true, variant = "ghost", size = "icon-xs", disabled, ...props }: CopyButtonProps) {
  const [status, setStatus] = React.useState<"idle" | "pending" | "copied" | "error">("idle")
  const request = React.useRef(0)
  const busy = React.useRef(false)
  const icon = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    request.current++
    busy.current = false
    setStatus("idle")
    return () => { request.current++ }
  }, [value])
  React.useEffect(() => {
    if (status !== "copied") return
    const timeout = window.setTimeout(() => setStatus("idle"), 2200)
    return () => window.clearTimeout(timeout)
  }, [status])
  React.useLayoutEffect(() => {
    if (!animated || status === "idle" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animation = icon.current?.animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "scale(1)" }], { duration: 160, easing: "ease-out" })
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => animation?.cancel()
    preference.addEventListener("change", stop)
    return () => { stop(); preference.removeEventListener("change", stop) }
  }, [status, animated])
  async function copy() {
    if (busy.current || disabled) return
    const current = ++request.current
    busy.current = true
    setStatus("pending")
    try { await navigator.clipboard.writeText(value); if (current === request.current) setStatus("copied") }
    catch { if (current === request.current) setStatus("error") }
    finally { if (current === request.current) busy.current = false }
  }
  const Icon = status === "copied" ? Check : status === "error" ? CircleAlert : status === "pending" ? LoaderCircle : Copy
  return <span data-slot="copy-button" className="inline-grid justify-items-start align-middle">
    <Button {...props} type="button" variant={variant} size={size} disabled={disabled} aria-label={label} aria-busy={status === "pending"} aria-disabled={disabled || status === "pending"} title={status === "copied" ? "已复制" : status === "error" ? "复制失败，点击重试" : label} onClick={event => { event.stopPropagation(); void copy() }}>
      <span ref={icon} aria-hidden="true" className="inline-flex"><Icon className={cn("size-3.5", status === "error" && "text-destructive", animated && status === "pending" && "animate-spin motion-reduce:animate-none")} /></span>
    </Button>
    <span role="status" className={status === "error" ? "mt-1 block max-w-52 text-xs whitespace-normal text-destructive" : "sr-only"}>{status === "copied" ? "已复制" : status === "error" ? "复制失败，请选择完整内容复制" : ""}</span>
  </span>
}

export { CopyButton }
export type { CopyButtonProps }
