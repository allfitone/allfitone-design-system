import * as React from "react"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"
import { Spinner } from "./spinner.js"

type TableDensity = "comfortable" | "compact"
type TableAlign = "start" | "center" | "end"
type TableStateKind = "loading" | "empty" | "error"
type TableSortDirection = "ascending" | "descending" | "none"

type TableProps = React.ComponentProps<"table"> & {
  density?: TableDensity
  containerClassName?: string
  scrollAreaLabel?: string
}

function Table({
  className,
  containerClassName,
  density = "comfortable",
  scrollAreaLabel,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      data-density={density}
      role={scrollAreaLabel ? "region" : undefined}
      aria-label={scrollAreaLabel}
      tabIndex={scrollAreaLabel ? 0 : undefined}
      className={cn(
        "relative w-full overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--afo-shadow-card)]",
        containerClassName
      )}
    >
      <table
        data-slot="table"
        data-density={density}
        className={cn(
          "group/table w-full min-w-max caption-bottom border-collapse text-sm text-card-foreground",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-muted/65 [&_tr]:border-b [&_tr]:border-input",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-input bg-muted/45 font-semibold [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

type TableRowProps = React.ComponentProps<"tr"> & {
  selected?: boolean
}

function TableRow({
  className,
  selected = false,
  ...props
}: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-state={selected ? "selected" : undefined}
      className={cn(
        "border-b border-border transition-colors duration-[var(--afo-motion-feedback-duration)] hover:bg-muted/50 data-[state=selected]:bg-[var(--afo-accent-soft)] data-[state=selected]:[&>td:first-child]:shadow-[inset_3px_0_0_var(--primary)]",
        className
      )}
      {...props}
    />
  )
}

type TableHeadProps = Omit<React.ComponentProps<"th">, "align"> & {
  align?: TableAlign
}

function TableHead({
  className,
  align = "start",
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      data-align={align}
      className={cn(
        "h-12 px-4 text-left align-middle text-xs font-extrabold tracking-[var(--afo-letter-spacing-micro)] text-muted-foreground uppercase whitespace-nowrap group-data-[density=compact]/table:h-10 group-data-[density=compact]/table:px-3 data-[align=center]:text-center data-[align=end]:text-right [&[aria-sort]]:text-foreground [&:has([data-slot=checkbox])]:w-14 [&:has([data-slot=checkbox])]:px-1.5",
        className
      )}
      {...props}
    />
  )
}

type TableSortButtonProps = Omit<
  React.ComponentProps<"button">,
  "aria-label" | "type"
> & {
  "aria-label": string
  direction: TableSortDirection
}

function TableSortButton({
  children,
  className,
  direction,
  ...props
}: TableSortButtonProps) {
  return (
    <button
      data-slot="table-sort-button"
      data-direction={direction}
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 border-0 bg-transparent p-0 text-left text-inherit uppercase shadow-none outline-none [font:inherit] [letter-spacing:inherit] transition-colors hover:text-foreground focus-visible:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {direction === "none" ? (
        <span
          data-slot="table-sort-indicator"
          className="flex flex-col -space-y-1.5 text-muted-foreground"
        >
          <FoundationIcon name="collapse" size="xs" decorative />
          <FoundationIcon name="expand" size="xs" decorative />
        </span>
      ) : (
        <FoundationIcon
          name={direction === "ascending" ? "collapse" : "expand"}
          size="xs"
          decorative
        />
      )}
    </button>
  )
}

type TableCellProps = Omit<React.ComponentProps<"td">, "align"> & {
  align?: TableAlign
  numeric?: boolean
}

function TableCell({
  className,
  align = "start",
  numeric = false,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      data-align={align}
      data-numeric={numeric || undefined}
      className={cn(
        "px-4 py-3 align-middle whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2 data-[align=center]:text-center data-[align=end]:text-right data-[numeric=true]:font-display data-[numeric=true]:text-base data-[numeric=true]:leading-none data-[numeric=true]:font-semibold data-[numeric=true]:tracking-[var(--afo-letter-spacing-athletic)] data-[numeric=true]:tabular-nums [&:has([data-slot=checkbox])]:w-14 [&:has([data-slot=checkbox])]:px-1.5",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "border-t border-border bg-muted/25 px-4 py-3 text-left text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type TableStateProps = Omit<
  React.ComponentProps<"td">,
  "align" | "children"
> & {
  colSpan: number
  state: TableStateKind
  title: string
  description?: string
  action?: React.ReactNode
}

function TableState({
  className,
  colSpan,
  state,
  title,
  description,
  action,
  ...props
}: TableStateProps) {
  const isLoading = state === "loading"

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        data-slot="table-state"
        data-state={state}
        colSpan={colSpan}
        className={cn("h-48 whitespace-normal", className)}
        {...props}
      >
        <div
          data-slot="table-state-content"
          role={state === "error" ? "alert" : isLoading ? undefined : "status"}
          aria-live={isLoading ? undefined : "polite"}
          className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 px-4 py-8 text-center"
        >
          <span
            data-slot="table-state-media"
            className="grid size-11 place-items-center rounded-lg rounded-tr-sm border border-input bg-[var(--afo-control-surface)] text-muted-foreground shadow-[var(--afo-control-shadow)]"
          >
            {isLoading ? (
              <Spinner label={title} />
            ) : (
              <FoundationIcon
                name={state === "error" ? "error" : "operation"}
                size="md"
                decorative
              />
            )}
          </span>
          <div className="flex flex-col gap-1">
            <strong className="text-sm font-bold text-foreground">{title}</strong>
            {description ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action}
        </div>
      </TableCell>
    </TableRow>
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortButton,
  TableState,
}
export type {
  TableAlign,
  TableDensity,
  TableProps,
  TableRowProps,
  TableSortButtonProps,
  TableSortDirection,
  TableStateKind,
  TableStateProps,
}
