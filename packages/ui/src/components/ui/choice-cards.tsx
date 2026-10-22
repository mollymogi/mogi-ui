"use client"

import * as React from "react"
import { cn } from "@mogi-ui/ui/lib/utils"

type ChoiceCardOption = {value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean}
type ChoiceCardsProps = Omit<React.ComponentProps<"fieldset">, "onChange"> & {
  legend: string
  name?: string
  value: string
  options: ChoiceCardOption[]
  onValueChange: (value: string) => void
}
// mogi: Native radio semantics provide arrow-key navigation and form values.
function ChoiceCards({legend, name, value, options, onValueChange, disabled, className, ...props}: ChoiceCardsProps) {
  const generatedName = React.useId()
  return <fieldset {...props} disabled={disabled} data-slot="choice-cards" className={cn("grid min-w-0 gap-3", className)}>
    <legend className="mb-3 text-sm font-medium">{legend}</legend>
    <div className="grid min-w-0 gap-3 sm:grid-cols-3">{options.map(option => <label key={option.value}
      data-state={option.value === value ? "checked" : "unchecked"}
      className={cn("relative flex min-w-0 cursor-pointer items-start gap-3 rounded-lg border border-input bg-card p-4 text-card-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi hover:bg-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50", option.value === value && "border-ring bg-accent text-accent-foreground")}>
      <input type="radio" name={name ?? generatedName} value={option.value} checked={option.value === value}
        disabled={disabled || option.disabled} onChange={() => onValueChange(option.value)} className="mt-1 size-4 shrink-0 accent-link [color-scheme:light] dark:[color-scheme:dark]" />
      <span className="grid min-w-0 gap-1 wrap-anywhere"><span className="text-sm font-semibold">{option.label}</span>
        {option.description != null && <span className="text-sm text-muted-foreground">{option.description}</span>}</span>
    </label>)}</div>
  </fieldset>
}
export { ChoiceCards }
export type { ChoiceCardsProps, ChoiceCardOption }
