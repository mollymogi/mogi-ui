"use client"

import * as React from "react"
import { Check, CircleAlert, LoaderCircle, type LucideIcon } from "lucide-react"
import { Button } from "@mogi-ui/ui/components/button"
import { cn } from "@mogi-ui/ui/lib/utils"

type FeedbackButtonProps = Omit<React.ComponentProps<typeof Button>, "asChild" | "onClick" | "children" | "type" | "aria-label"> & {
  children: string
  onAction: () => Promise<unknown> | unknown
  icon?: LucideIcon
  pendingLabel?: string
  successLabel?: string
  errorLabel?: string
  animated?: boolean
}

function FeedbackButton({ children, onAction, icon: Icon, pendingLabel = "处理中", successLabel = "已完成", errorLabel = "失败，重试", animated = true, disabled, className, ...props }: FeedbackButtonProps) {
  const [state, setState] = React.useState<"idle" | "pending" | "success" | "error">("idle")
  const busy = React.useRef(false)
  const mounted = React.useRef(true)
  const content = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  React.useEffect(() => {
    if (state !== "success") return
    const timer = window.setTimeout(() => setState("idle"), 2200)
    return () => window.clearTimeout(timer)
  }, [state])
  React.useLayoutEffect(() => {
    if (!animated || state === "idle" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animation = content.current?.animate([{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 160, easing: "ease-out" })
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => animation?.cancel()
    preference.addEventListener("change", stop)
    return () => { stop(); preference.removeEventListener("change", stop) }
  }, [state, animated])
  async function run() {
    if (busy.current || disabled) return
    busy.current = true
    setState("pending")
    try { await onAction(); if (mounted.current) setState("success") }
    catch { if (mounted.current) setState("error") }
    finally { busy.current = false }
  }
  const label = { idle: children, pending: pendingLabel, success: successLabel, error: errorLabel }[state]
  const StateIcon = state === "pending" ? LoaderCircle : state === "success" ? Check : state === "error" ? CircleAlert : Icon
  return <span className="inline-grid">
    <Button {...props} type="button" className={cn("relative", className)} disabled={disabled} aria-disabled={disabled || state === "pending"} aria-busy={state === "pending"} aria-label={label} data-feedback={state} onClick={() => { void run() }}>
      <span aria-hidden="true" className="invisible grid items-center pl-6">{[children, pendingLabel, successLabel, errorLabel].map((text, i) => <span key={i} className="[grid-area:1/1]">{text}</span>)}</span>
      <span ref={content} aria-hidden="true" className="absolute inset-0 flex items-center justify-center gap-2">{StateIcon && <StateIcon className={cn("size-4 shrink-0", animated && state === "pending" && "animate-spin motion-reduce:animate-none")} />}{label}</span>
    </Button>
    <span role="status" className="sr-only">{state === "idle" ? "" : label}</span>
  </span>
}

export { FeedbackButton }
export type { FeedbackButtonProps }
