"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "../lib/utils.js"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex size-11 shrink-0 items-center justify-center rounded-full outline-none before:absolute before:size-5 before:rounded-full before:border before:border-input before:bg-[var(--afo-control-surface)] before:shadow-[var(--afo-control-shadow)] before:transition-[background-color,border-color,box-shadow,transform] hover:before:border-[var(--afo-color-border-strong)] focus-visible:before:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:before:border-destructive data-checked:text-[var(--afo-color-accent-on-accent)] data-checked:before:scale-105 data-checked:before:border-transparent data-checked:before:bg-[image:var(--afo-gradient-accent)]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative z-10 flex size-5 scale-75 items-center justify-center transition-transform group-data-checked/radio-group-item:scale-100"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--afo-color-accent-on-accent)]" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
