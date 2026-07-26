"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"

function Combobox<
  Value,
  Multiple extends boolean | undefined = false,
>(props: ComboboxPrimitive.Root.Props<Value, Multiple>) {
  return <ComboboxPrimitive.Root {...props} />
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxInputGroup({
  className,
  ...props
}: ComboboxPrimitive.InputGroup.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "group/combobox-input flex min-h-11 w-full min-w-0 items-stretch rounded-lg border border-input bg-accent transition-[background-color,border-color,box-shadow] hover:border-[var(--afo-color-border-strong)] focus-within:border-ring focus-within:bg-card focus-within:shadow-[0_0_0_2px_var(--afo-color-neutral-chalk),0_0_0_4px_var(--afo-color-ink-void)] has-aria-invalid:border-destructive has-aria-invalid:bg-[var(--afo-danger-soft)] data-disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "min-h-11 min-w-0 flex-1 appearance-none border-0 bg-transparent px-3.5 py-2 text-base font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:shadow-none disabled:cursor-not-allowed disabled:text-muted-foreground md:text-sm",
        className
      )}
      {...props}
    />
  )
}

function ComboboxActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-actions"
      className={cn(
        "ml-auto flex shrink-0 items-center self-stretch",
        className
      )}
      {...props}
    />
  )
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  const hasContent = React.Children.count(children) > 0

  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-transparent px-3 text-sm font-bold text-foreground outline-none transition-[background-color,border-color,color,box-shadow] hover:bg-muted focus-visible:border-ring disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50 data-popup-open:bg-muted",
        !hasContent && "size-11 p-0",
        className
      )}
      {...props}
    >
      {children}
      <FoundationIcon
        name="expand"
        size="sm"
        decorative
        className="pointer-events-none text-muted-foreground"
      />
    </ComboboxPrimitive.Trigger>
  )
}

type ComboboxClearProps = Omit<
  ComboboxPrimitive.Clear.Props,
  "aria-label"
> & {
  "aria-label": string
}

function ComboboxClear({
  className,
  ...props
}: ComboboxClearProps) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-muted-foreground outline-none transition-[background-color,color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    >
      <FoundationIcon name="close" size="sm" decorative />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "group/combobox-content relative isolate z-50 max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[min(22rem,var(--available-width))] origin-(--transform-origin) overflow-hidden rounded-xl bg-popover text-popover-foreground duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:zoom-in-95 data-closed:animate-out data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex min-h-11 w-full cursor-default items-center gap-2 rounded-lg py-2 pr-10 pl-3 text-sm font-medium outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-[var(--afo-accent-soft)] data-selected:shadow-[inset_3px_0_0_var(--primary)] data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-3 grid size-5 place-items-center text-primary" />
        }
      >
        <FoundationIcon name="check" size="sm" decorative />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-3 py-2 text-xs font-bold tracking-[var(--afo-letter-spacing-utility)] text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection({
  ...props
}: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection
      data-slot="combobox-collection"
      {...props}
    />
  )
}

function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground empty:p-0",
        className
      )}
      {...props}
    />
  )
}

type ComboboxStatusVariant = "default" | "loading" | "error"

type ComboboxStatusProps = ComboboxPrimitive.Status.Props & {
  variant?: ComboboxStatusVariant
}

function ComboboxStatus({
  className,
  variant = "default",
  ...props
}: ComboboxStatusProps) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      data-variant={variant}
      className={cn(
        "flex min-h-0 items-center gap-2 px-3 py-2 text-xs leading-relaxed text-muted-foreground empty:p-0 data-[variant=error]:font-semibold data-[variant=error]:text-danger-text",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-11 min-w-0 flex-1 flex-wrap items-center gap-1.5 px-1.5 py-1",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  ...props
}: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex min-h-11 min-w-0 items-center gap-1 rounded-md border border-border bg-muted pl-2.5 text-xs font-bold text-foreground has-data-[slot=combobox-chip-remove]:pl-3 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

type ComboboxChipRemoveProps = Omit<
  ComboboxPrimitive.ChipRemove.Props,
  "aria-label"
> & {
  "aria-label": string
}

function ComboboxChipRemove({
  className,
  ...props
}: ComboboxChipRemoveProps) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-md border-0 bg-transparent text-muted-foreground outline-none transition-[background-color,color,box-shadow] hover:bg-accent hover:text-foreground focus-visible:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <FoundationIcon name="close" size="sm" decorative />
    </ComboboxPrimitive.ChipRemove>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      className={cn(
        "min-h-11 min-w-12 flex-1 appearance-none border-0 bg-transparent px-2 text-base font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:shadow-none disabled:cursor-not-allowed disabled:text-muted-foreground md:text-sm",
        className
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxActions,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
export type {
  ComboboxChipRemoveProps,
  ComboboxClearProps,
  ComboboxStatusProps,
  ComboboxStatusVariant,
}
