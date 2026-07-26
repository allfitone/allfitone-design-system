"use client"

import * as React from "react"
import {
  Command as CommandPrimitive,
  useCommandState,
} from "cmdk"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog.js"

type CommandProps = Omit<
  React.ComponentProps<typeof CommandPrimitive>,
  "label"
> & {
  label: string
}

function Command({
  className,
  label,
  ...props
}: CommandProps) {
  return (
    <CommandPrimitive
      data-slot="command"
      label={label}
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

type CommandDialogProps = Omit<
  React.ComponentProps<typeof Dialog>,
  "children"
> & {
  children?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  finalFocus?: React.ComponentProps<typeof DialogContent>["finalFocus"]
  initialFocus?: React.ComponentProps<typeof DialogContent>["initialFocus"]
  showCloseButton?: boolean
  contentClassName?: string
}

function CommandDialog({
  title,
  description,
  finalFocus,
  initialFocus,
  showCloseButton = true,
  contentClassName,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        showCloseButton={showCloseButton}
        className={cn(
          "w-[calc(100%-2rem)] max-w-xl gap-0 overflow-hidden border-[var(--afo-color-border-strong)] bg-popover p-0 sm:w-full [&_[data-slot=command-input-wrapper]]:pr-14",
          contentClassName
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div data-slot="command-dialog-content">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>

function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex min-h-14 items-center gap-3 border-b border-border px-4"
    >
      <FoundationIcon
        name="search"
        size="md"
        decorative
        className="shrink-0 text-muted-foreground"
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-14 min-w-0 flex-1 border-0 bg-transparent text-base font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-80 scroll-py-2 overflow-x-hidden overflow-y-auto overscroll-contain p-1.5",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const resultCount = useCommandState((state) => state.filtered.count)

  if (resultCount > 0) {
    return null
  }

  return (
    <div
      data-slot="command-empty"
      role="option"
      aria-disabled="true"
      aria-selected="false"
      className={cn(
        "px-5 py-10 text-center text-sm leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandLoading({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Loading>) {
  return (
    <CommandPrimitive.Loading
      data-slot="command-loading"
      className={cn(
        "flex min-h-16 items-center gap-2 px-4 py-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden py-1 text-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[var(--afo-letter-spacing-utility)] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  alwaysRender = false,
  ...props
}: React.ComponentProps<"div"> & {
  alwaysRender?: boolean
}) {
  const search = useCommandState((state) => state.search)

  if (!alwaysRender && search.length > 0) {
    return null
  }

  return (
    <div
      data-slot="command-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex min-h-11 cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:shadow-[inset_3px_0_0_var(--primary)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground data-[selected=true]:[&_svg]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="command-shortcut"
      aria-hidden="true"
      className={cn(
        "ml-auto inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-semibold tracking-wide text-muted-foreground group-data-[selected=true]/command-item:border-[var(--afo-color-border-strong)] group-data-[selected=true]/command-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandShortcut,
}
export type { CommandDialogProps, CommandInputProps, CommandProps }
