"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type Row,
  type RowData,
  type Table as TanStackTable,
  type TableOptions,
} from "@tanstack/react-table"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"
import { Button } from "./button.js"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu.js"
import { IconButton } from "./icon-button.js"
import { Input } from "./input.js"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select.js"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortButton,
  TableState,
  type TableAlign,
  type TableProps,
  type TableRowProps,
  type TableStateKind,
} from "./table.js"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: TableAlign
    label?: string
    numeric?: boolean
  }
}

type DataTableOptions<TData> = Omit<TableOptions<TData>, "getCoreRowModel"> & {
  getCoreRowModel?: TableOptions<TData>["getCoreRowModel"]
}

function useDataTable<TData>(options: DataTableOptions<TData>) {
  return useReactTable({
    getCoreRowModel: getCoreRowModel(),
    ...(!options.manualFiltering && !options.getFilteredRowModel
      ? { getFilteredRowModel: getFilteredRowModel() }
      : {}),
    ...(!options.manualSorting && !options.getSortedRowModel
      ? { getSortedRowModel: getSortedRowModel() }
      : {}),
    ...(!options.manualPagination && !options.getPaginationRowModel
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    ...options,
  })
}

type DataTableState = {
  state: TableStateKind
  title: string
  description?: string
  action?: React.ReactNode
}

type DataTableProps<TData> = Omit<TableProps, "children"> & {
  table: TanStackTable<TData>
  caption?: React.ReactNode
  state?: DataTableState
  emptyState?: Omit<DataTableState, "state">
  getRowProps?: (
    row: Row<TData>
  ) => Omit<TableRowProps, "children" | "selected">
}

function DataTable<TData>({
  table,
  caption,
  state,
  emptyState,
  getRowProps,
  ...props
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const visibleColumnCount = Math.max(table.getVisibleLeafColumns().length, 1)
  const displayState =
    state ??
    (rows.length === 0
      ? {
          state: "empty" as const,
          title: emptyState?.title ?? "No results",
          ...(emptyState?.description
            ? { description: emptyState.description }
            : {}),
          ...(emptyState?.action ? { action: emptyState.action } : {}),
        }
      : undefined)

  return (
    <Table
      aria-busy={state?.state === "loading" || undefined}
      {...props}
    >
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              const meta = header.column.columnDef.meta

              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  {...(meta?.align ? { align: meta.align } : {})}
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {displayState ? (
          <TableState
            colSpan={visibleColumnCount}
            state={displayState.state}
            title={displayState.title}
            {...(displayState.description
              ? { description: displayState.description }
              : {})}
            {...(displayState.action ? { action: displayState.action } : {})}
          />
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.id}
              selected={row.getIsSelected()}
              {...getRowProps?.(row)}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta

                return (
                  <TableCell
                    key={cell.id}
                    {...(meta?.align ? { align: meta.align } : {})}
                    {...(meta?.numeric ? { numeric: true } : {})}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: React.ReactNode
  sortLabel: string
  className?: string
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  sortLabel,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>
  }

  const sorted = column.getIsSorted()
  const direction =
    sorted === "asc"
      ? "ascending"
      : sorted === "desc"
        ? "descending"
        : "none"

  return (
    <TableSortButton
      aria-label={sortLabel}
      direction={direction}
      className={className}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
    </TableSortButton>
  )
}

function DataTableToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  )
}

type DataTableFilterInputProps<TData> = Omit<
  React.ComponentProps<typeof Input>,
  "defaultValue" | "onChange" | "value"
> & {
  table: TanStackTable<TData>
  label: string
  columnId?: string
}

function DataTableFilterInput<TData>({
  table,
  label,
  columnId,
  className,
  id,
  ...props
}: DataTableFilterInputProps<TData>) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const column = columnId ? table.getColumn(columnId) : undefined
  const value = column
    ? column.getFilterValue()
    : table.getState().globalFilter

  return (
    <label
      data-slot="data-table-filter"
      htmlFor={inputId}
      className="relative block w-full sm:max-w-sm"
    >
      <span className="sr-only">{label}</span>
      <FoundationIcon
        name="search"
        size="sm"
        decorative
        className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id={inputId}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => {
          if (column) {
            column.setFilterValue(event.target.value)
          } else {
            table.setGlobalFilter(event.target.value)
          }
        }}
        className={cn("pl-10", className)}
        {...props}
      />
    </label>
  )
}

type DataTableViewOptionsProps<TData> = {
  table: TanStackTable<TData>
  label?: string
  title?: string
  getColumnLabel?: (column: Column<TData, unknown>) => React.ReactNode
  className?: string
}

function DataTableViewOptions<TData>({
  table,
  label = "Columns",
  title = "Visible columns",
  getColumnLabel,
  className,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className={className} />}
      >
        <FoundationIcon
          name="settings"
          size="sm"
          data-icon="inline-start"
          decorative
        />
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) =>
                column.toggleVisibility(Boolean(checked))
              }
            >
              {getColumnLabel?.(column) ??
                column.columnDef.meta?.label ??
                column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type DataTableSelectionBarProps<TData> = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  table: TanStackTable<TData>
  children?: React.ReactNode
  clearLabel?: string
  getSelectionLabel?: (count: number) => React.ReactNode
  selectedCount?: number
}

const defaultSelectionLabel = (count: number) => `${count} selected`

function DataTableSelectionBar<TData>({
  table,
  children,
  clearLabel = "Clear selection",
  getSelectionLabel = defaultSelectionLabel,
  selectedCount,
  className,
  ...props
}: DataTableSelectionBarProps<TData>) {
  const count =
    selectedCount ??
    Object.values(table.getState().rowSelection).filter(Boolean).length

  if (count === 0) {
    return null
  }

  return (
    <div
      data-slot="data-table-selection-bar"
      className={cn(
        "flex flex-col gap-3 border-l-4 border-primary bg-[var(--afo-accent-soft)] px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <strong
        role="status"
        aria-live="polite"
        className="text-sm font-extrabold whitespace-nowrap text-foreground"
      >
        {getSelectionLabel(count)}
      </strong>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetRowSelection()}
        >
          {clearLabel}
        </Button>
      </div>
    </div>
  )
}

type DataTablePaginationLabels = {
  rowsPerPage: string
  page: string
  of: string
  previousPage: string
  nextPage: string
}

type DataTablePaginationProps<TData> = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  table: TanStackTable<TData>
  pageSizeOptions?: readonly number[]
  labels?: Partial<DataTablePaginationLabels>
}

const defaultPaginationLabels: DataTablePaginationLabels = {
  rowsPerPage: "Rows per page",
  page: "Page",
  of: "of",
  previousPage: "Previous page",
  nextPage: "Next page",
}

const defaultPageSizeOptions = [10, 20, 50] as const

function DataTablePagination<TData>({
  table,
  pageSizeOptions = defaultPageSizeOptions,
  labels,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const copy = { ...defaultPaginationLabels, ...labels }
  const pageSize = table.getState().pagination.pageSize
  const options = [...new Set([...pageSizeOptions, pageSize])].sort(
    (left, right) => left - right
  )
  const pageCount = Math.max(table.getPageCount(), 1)
  const currentPage = Math.min(
    table.getState().pagination.pageIndex + 1,
    pageCount
  )

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-[var(--afo-letter-spacing-utility)] text-muted-foreground uppercase whitespace-nowrap">
          {copy.rowsPerPage}
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            if (value !== null) {
              table.setPageSize(Number(value))
            }
          }}
        >
          <SelectTrigger
            size="sm"
            aria-label={copy.rowsPerPage}
            className="min-w-20 bg-transparent"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              <SelectLabel>{copy.rowsPerPage}</SelectLabel>
              {options.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <span
          aria-live="polite"
          className="min-w-24 text-center font-display text-sm font-semibold tracking-[var(--afo-letter-spacing-athletic)] text-muted-foreground tabular-nums"
        >
          {copy.page} {currentPage} {copy.of} {pageCount}
        </span>
        <IconButton
          aria-label={copy.previousPage}
          variant="outline"
          size="icon-sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <FoundationIcon name="back" size="sm" decorative />
        </IconButton>
        <IconButton
          aria-label={copy.nextPage}
          variant="outline"
          size="icon-sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <FoundationIcon name="forward" size="sm" decorative />
        </IconButton>
      </div>
    </div>
  )
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableFilterInput,
  DataTablePagination,
  DataTableSelectionBar,
  DataTableToolbar,
  DataTableViewOptions,
  useDataTable,
}
export type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
export type {
  DataTableColumnHeaderProps,
  DataTableFilterInputProps,
  DataTableOptions,
  DataTablePaginationLabels,
  DataTablePaginationProps,
  DataTableProps,
  DataTableSelectionBarProps,
  DataTableState,
  DataTableViewOptionsProps,
}
