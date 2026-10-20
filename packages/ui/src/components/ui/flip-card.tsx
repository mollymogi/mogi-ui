"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@mogi-ui/ui/components/button"
import { cn } from "@mogi-ui/ui/lib/utils"

type FlipCardProps = React.ComponentProps<"div"> & {
  front: React.ReactNode
  back: React.ReactNode
  showBackLabel?: string
  showFrontLabel?: string
}

// mogi: click-driven so touch and keyboard users get the same interaction.
// Only the visible face is accessible or interactive; the toggle keeps focus.
function FlipCard({ front, back, showBackLabel = "查看背面", showFrontLabel = "返回正面", className, ...props }: FlipCardProps) {
  const [flipped, setFlipped] = React.useState(false)
  const id = React.useId()

  return (
    <div data-slot="flip-card" data-flipped={flipped} className={cn("min-w-0 [perspective:1200px]", className)} {...props}>
      <div id={id} data-slot="flip-card-inner" className={cn(
        "grid min-w-0 transition-transform duration-(--duration-mogi-slow) ease-mogi [transform-style:preserve-3d] motion-reduce:transform-none motion-reduce:transition-none",
        flipped && "[transform:rotateY(180deg)]"
      )}>
        <div data-slot="flip-card-front" aria-hidden={flipped} inert={flipped} className={cn(
          "min-w-0 [grid-area:1/1] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
          flipped && "motion-reduce:invisible"
        )}>{front}</div>
        <div data-slot="flip-card-back" aria-hidden={!flipped} inert={!flipped} className={cn(
          "min-w-0 [grid-area:1/1] [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] motion-reduce:transform-none",
          !flipped && "motion-reduce:invisible"
        )}>{back}</div>
      </div>
      <Button type="button" data-slot="flip-card-toggle" variant="ghost" size="sm" className="mt-3 w-full" aria-controls={id} aria-pressed={flipped} onClick={() => setFlipped(value => !value)}>
        <RotateCcw />{flipped ? showFrontLabel : showBackLabel}
      </Button>
    </div>
  )
}

export { FlipCard }
export type { FlipCardProps }
