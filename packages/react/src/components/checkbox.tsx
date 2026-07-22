"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "../lib/utils.js"
import { FoundationIcon } from "../icons.js"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative flex size-11 shrink-0 items-center justify-center rounded-lg outline-none before:absolute before:size-5 before:rounded-sm before:border before:border-input before:bg-background before:transition-colors group-has-disabled/field:opacity-50 focus-visible:before:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:before:border-destructive data-checked:before:border-primary data-checked:before:bg-primary data-checked:text-primary-foreground data-indeterminate:before:border-primary data-indeterminate:before:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="relative z-10 grid place-content-center text-current transition-none"
      >
        <FoundationIcon name="check" size="sm" decorative className="group-data-indeterminate/checkbox:hidden" />
        <FoundationIcon name="indeterminate" size="sm" decorative className="hidden group-data-indeterminate/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
