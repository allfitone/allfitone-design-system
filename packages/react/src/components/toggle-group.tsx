"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"

import { cn } from "../lib/utils.js"

type ToggleGroupProps<Value extends string = string> =
  ToggleGroupPrimitive.Props<Value>

function ToggleGroup<Value extends string>({
  className,
  orientation = "horizontal",
  multiple = false,
  ...props
}: ToggleGroupProps<Value>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-orientation={orientation}
      data-multiple={multiple ? "" : undefined}
      orientation={orientation}
      multiple={multiple}
      className={cn(
        "inline-flex w-fit max-w-full items-stretch gap-1 rounded-[var(--afo-radius-control)] border border-border bg-[var(--afo-control-surface)] p-1 shadow-[var(--afo-control-shadow)] data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

type ToggleGroupItemProps<Value extends string = string> =
  TogglePrimitive.Props<Value>

function ToggleGroupItem<Value extends string>({
  className,
  ...props
}: ToggleGroupItemProps<Value>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        "relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 overflow-hidden rounded-[calc(var(--afo-radius-control)-0.25rem)] border border-transparent bg-transparent px-3 py-2 text-xs font-extrabold whitespace-nowrap text-muted-foreground outline-none transition-[color,background-color,border-color,box-shadow] before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full before:bg-primary before:opacity-0 before:transition-opacity hover:bg-[var(--afo-control-surface-hover)] hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-pressed:border-primary/20 data-pressed:bg-[var(--afo-color-accent-tonal)] data-pressed:text-[var(--afo-color-text-accent)] data-pressed:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_8%,transparent)] data-pressed:before:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupItemProps,
  type ToggleGroupProps,
}
