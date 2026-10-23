"use client"

import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

type AudioPreviewProps = Omit<React.ComponentProps<"audio">, "controls" | "autoPlay"> & {
  label: string
  description?: React.ReactNode
  containerClassName?: string
}
// mogi: The caller owns src/object URL lifetime. Never autoplay or fetch audio in component code.
function AudioPreview({label, description, containerClassName, className, id, preload = "metadata", ...props}: AudioPreviewProps) {
  const generatedId = React.useId()
  const audioId = id ?? generatedId
  return <div data-slot="audio-preview" className={cn("grid min-w-0 gap-2", containerClassName)}>
    <p id={`${audioId}-label`} className="text-sm font-medium text-foreground">{label}</p>
    <audio {...props} id={audioId} aria-labelledby={props["aria-label"] ? undefined : `${audioId}-label`} controls autoPlay={false} preload={preload}
      className={cn("w-full min-w-0 [color-scheme:light] dark:[color-scheme:dark]", className)}>你的浏览器不支持音频试听。</audio>
    {description != null && <div className="text-sm text-muted-foreground">{description}</div>}
  </div>
}
export { AudioPreview }
export type { AudioPreviewProps }
