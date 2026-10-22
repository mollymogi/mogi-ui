"use client"

import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

function NumberGlyph({ character, animated }: { character: string; animated: boolean }) {
  const current = React.useRef<HTMLSpanElement>(null)
  const outgoing = React.useRef<HTMLSpanElement>(null)
  const previous = React.useRef(character)
  React.useLayoutEffect(() => {
    const before = previous.current
    previous.current = character
    const incoming = current.current, old = outgoing.current
    if (!incoming || !old || before === character || !animated || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    old.textContent = before
    const direction = Number(character) >= Number(before) ? 1 : -1
    const timing = { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" }
    const enter = incoming.animate([{ transform: `translateY(${direction * 100}%)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], timing)
    const exit = old.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${-direction * 100}%)`, opacity: 0 }], timing)
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => { enter.cancel(); exit.cancel() }
    preference.addEventListener("change", stop)
    return () => { stop(); preference.removeEventListener("change", stop) }
  }, [character, animated])
  return <span className="relative inline-grid overflow-hidden align-bottom leading-[1.2]"><span ref={current} className="inline-block">{character}</span><span ref={outgoing} className="pointer-events-none absolute inset-0 opacity-0" /></span>
}

type AnimatedNumberProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number
  animated?: boolean
  locale?: string
  formatOptions?: Intl.NumberFormatOptions
}

/** Shows the real value immediately; only subsequent digit changes animate. */
function AnimatedNumber({ value, animated = true, locale = "zh-CN", formatOptions, className, ...props }: AnimatedNumberProps) {
  const text = new Intl.NumberFormat(locale, formatOptions).format(value)
  const characters = Array.from(text)
  return <span data-slot="animated-number" className={cn("inline-flex font-mono tabular-nums", className)} {...props}>
    <span className="sr-only">{text}</span><span aria-hidden="true" className="inline-flex">{characters.map((character, index) => /[0-9]/.test(character) ? <NumberGlyph key={characters.length - index} character={character} animated={animated} /> : <span key={characters.length - index}>{character}</span>)}</span>
  </span>
}

export { AnimatedNumber }
export type { AnimatedNumberProps }
