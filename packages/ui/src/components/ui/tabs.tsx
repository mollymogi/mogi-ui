"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@mogi-ui/ui/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const SlidingTabsContext = React.createContext(false)

function TabsList({
  className,
  variant = "default",
  animated = true,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants> & { animated?: boolean }) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const indicatorRef = React.useRef<HTMLSpanElement>(null)
  React.useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator || !animated) return
    let previous: { x: number; y: number; width: number; height: number } | undefined
    let animation: Animation | undefined
    let previousActive: HTMLElement | null = null
    const update = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      if (!active) { indicator.style.visibility = "hidden"; previous = undefined; return }
      const outer = list.getBoundingClientRect(), rect = active.getBoundingClientRect()
      const vertical = list.closest('[data-slot="tabs"]')?.getAttribute("data-orientation") === "vertical"
      const line = variant === "line"
      const next = { x: rect.left - outer.left + list.scrollLeft + (line && vertical ? rect.width + 1 : 0), y: rect.top - outer.top + list.scrollTop + (line && !vertical ? rect.height + 4 : 0), width: line && vertical ? 2 : rect.width, height: line && !vertical ? 2 : rect.height }
      if (previous && Object.keys(next).every(key => next[key as keyof typeof next] === previous?.[key as keyof typeof next])) return
      const computed = getComputedStyle(indicator)
      const from = { transform: computed.transform, width: computed.width, height: computed.height }
      animation?.cancel()
      Object.assign(indicator.style, { visibility: "visible", width: `${next.width}px`, height: `${next.height}px`, transform: `translate(${next.x}px, ${next.y}px)` })
      if (previous && active !== previousActive && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animation = indicator.animate([from, { transform: `translate(${next.x}px, ${next.y}px)`, width: `${next.width}px`, height: `${next.height}px` }], { duration: 240, easing: "cubic-bezier(.22,1,.36,1)" })
      }
      previous = next
      previousActive = active
    }
    const resize = new ResizeObserver(update)
    resize.observe(list)
    list.querySelectorAll('[role="tab"]').forEach(tab => resize.observe(tab))
    const mutations = new MutationObserver(update)
    mutations.observe(list, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state", "dir"] })
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => animation?.cancel()
    preference.addEventListener("change", stop)
    list.addEventListener("scroll", update)
    update()
    return () => { resize.disconnect(); mutations.disconnect(); list.removeEventListener("scroll", update); preference.removeEventListener("change", stop); animation?.cancel() }
  }, [animated, variant])
  return (
    <SlidingTabsContext.Provider value={animated}><TabsPrimitive.List
      ref={node => { listRef.current = node; if (typeof ref === "function") return ref(node); else if (ref) ref.current = node }}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), "relative isolate", className)}
      {...props}
    >
      {animated && <span ref={indicatorRef} aria-hidden="true" data-slot="tabs-indicator" className={cn("pointer-events-none absolute top-0 left-0 -z-10 rounded-md", variant === "line" ? "bg-foreground" : "border border-transparent bg-background shadow-sm dark:border-input")} />}
      {children}
    </TabsPrimitive.List></SlidingTabsContext.Provider>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const animated = React.useContext(SlidingTabsContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all duration-(--duration-mogi) ease-mogi group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        animated && "data-[state=active]:bg-transparent! data-[state=active]:shadow-none! dark:data-[state=active]:bg-transparent! dark:data-[state=active]:border-transparent! after:opacity-0!",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
