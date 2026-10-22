"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@mogi-ui/ui/components/input"
import { Button } from "@mogi-ui/ui/components/button"
import { cn } from "@mogi-ui/ui/lib/utils"

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  containerClassName?: string
  showLabel?: string
  hideLabel?: string
}

function PasswordInput({ className, containerClassName, disabled, showLabel = "显示口令", hideLabel = "隐藏口令", ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  const generatedId = React.useId()
  const inputId = props.id ?? generatedId
  return <div data-slot="password-input" className={cn("relative min-w-0", containerClassName)}>
    <Input {...props} id={inputId} type={visible ? "text" : "password"} disabled={disabled} className={cn("pr-11", className)} />
    <Button type="button" variant="ghost" size="icon-sm" className="absolute top-1/2 right-1 -translate-y-1/2" disabled={disabled} aria-label={visible ? hideLabel : showLabel} aria-pressed={visible} aria-controls={inputId} onMouseDown={event => event.preventDefault()} onClick={() => setVisible(value => !value)}>
      {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
    </Button>
  </div>
}

export { PasswordInput }
export type { PasswordInputProps }
