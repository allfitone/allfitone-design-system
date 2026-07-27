"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  navLayout = "after",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      navLayout={navLayout}
      locale={locale}
      className={cn(
        "group/calendar relative max-w-full overflow-x-auto rounded-xl border border-border bg-card p-3 text-card-foreground [--cell-radius:var(--afo-radius-control)] [--cell-size:2.75rem] in-data-[slot=popover-content]:border-0 in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:p-0",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn(
          "relative flex w-full min-w-0 flex-col gap-5 md:w-max md:min-w-full md:flex-row",
          defaultClassNames.months
        ),
        month: cn(
          "relative flex w-full min-w-0 flex-col gap-3",
          props.showWeekNumber
            ? "md:w-[calc(var(--cell-size)*8)]"
            : "md:w-[calc(var(--cell-size)*7)]",
          defaultClassNames.month
        ),
        nav: cn(
          "pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "pointer-events-auto absolute top-0 left-0 inline-flex size-(--cell-size) items-center justify-center rounded-(--cell-radius) border border-transparent bg-transparent text-muted-foreground outline-none transition-[color,background-color,border-color] duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] hover:border-border hover:bg-muted hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "pointer-events-auto absolute top-0 right-0 inline-flex size-(--cell-size) items-center justify-center rounded-(--cell-radius) border border-transparent bg-transparent text-muted-foreground outline-none transition-[color,background-color,border-color] duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] hover:border-border hover:bg-muted hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-bold",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-bold select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-(--cell-size) items-center gap-1 rounded-(--cell-radius) px-2 text-sm [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn(
          "border-collapse",
          props.showWeekNumber
            ? "w-[calc(var(--cell-size)*8)]"
            : "w-[calc(var(--cell-size)*7)]",
          defaultClassNames.month_grid
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 py-1 text-xs font-bold tracking-[var(--afo-letter-spacing-utility)] text-muted-foreground uppercase select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-xs text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative size-(--cell-size) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-1/2 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-muted",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "relative isolate rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-secondary text-secondary-foreground data-[selected=true]:bg-transparent",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground opacity-45 aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-35",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        footer: cn(
          "pt-3 text-xs text-muted-foreground",
          defaultClassNames.footer
        ),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => {
          const isNamed = Boolean(
            rootProps["aria-label"] || rootProps["aria-labelledby"]
          )

          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              role={isNamed ? "region" : undefined}
              className={cn(className)}
              {...rootProps}
            />
          )
        },
        Chevron: ({ className, orientation, ...chevronProps }) => {
          const name =
            orientation === "left"
              ? "back"
              : orientation === "right"
                ? "forward"
                : orientation === "up"
                  ? "collapse"
                  : "expand"

          return (
            <FoundationIcon
              {...chevronProps}
              name={name}
              size="sm"
              decorative
              className={cn(className)}
            />
          )
        },
        DayButton: (dayButtonProps) => (
          <CalendarDayButton locale={locale} {...dayButtonProps} />
        ),
        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale> | undefined
}) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-slot="calendar-day-button"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 inline-flex size-(--cell-size) items-center justify-center rounded-(--cell-radius) border border-transparent bg-transparent font-display text-base leading-none font-semibold tabular-nums text-foreground outline-none transition-[color,background-color,border-color,box-shadow] duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] hover:border-border hover:bg-accent hover:text-accent-foreground group-data-[focused=true]/day:border-ring data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground disabled:pointer-events-none disabled:hover:border-transparent disabled:hover:bg-transparent",
        defaultClassNames.day_button,
        className
      )}
      {...props}
    />
  )
}

export type { DateRange, Matcher } from "react-day-picker"
export { Calendar, CalendarDayButton }
