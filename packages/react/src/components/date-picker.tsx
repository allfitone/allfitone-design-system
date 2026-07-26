"use client"

import * as React from "react"
import { format, isValid, parse, type Locale } from "date-fns"
import { dateMatchModifiers, type Matcher } from "react-day-picker"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"
import { Calendar } from "./calendar.js"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js"

type DatePickerCalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "onSelect" | "selected"
>

type DatePickerProps = Omit<
  React.ComponentProps<"input">,
  | "children"
  | "defaultValue"
  | "onChange"
  | "type"
  | "value"
> & {
  calendarLabel?: string
  calendarProps?: DatePickerCalendarProps
  clearLabel?: string
  defaultValue?: Date | undefined
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  formatHint?: string
  formatPattern?: string
  invalid?: boolean
  label: React.ReactNode
  locale?: Locale
  onInvalidChange?: (invalid: boolean) => void
  onValueChange?: (value: Date | undefined) => void
  openCalendarLabel?: string
  value?: Date | undefined
}

const hasOwn = (value: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(value, key)

function DatePicker(props: DatePickerProps) {
  const {
    "aria-describedby": ariaDescribedBy,
    calendarLabel = "Choose a date",
    calendarProps,
    className,
    clearLabel = "Clear date",
    defaultValue,
    description,
    disabled,
    errorMessage,
    formatHint = "MM/DD/YYYY",
    formatPattern = "MM/dd/yyyy",
    id: providedId,
    invalid = false,
    label,
    locale,
    onBlur,
    onInvalidChange,
    onKeyDown,
    onValueChange,
    openCalendarLabel = "Open calendar",
    placeholder,
    readOnly,
    required,
    value,
    ...inputProps
  } = props
  const generatedId = React.useId()
  const inputId = providedId ?? `date-picker-${generatedId}`
  const triggerId = `${inputId}-trigger`
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`
  const isControlled = hasOwn(props, "value")
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [draft, setDraft] = React.useState<string | null>(null)
  const [parseError, setParseError] = React.useState<
    "format" | "unavailable" | null
  >(null)
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const selected = isControlled ? value : uncontrolledValue
  const isInvalid = invalid || parseError !== null
  const disabledMatchers = calendarProps?.disabled as
    | Matcher
    | Matcher[]
    | undefined
  const formattedValue = selected
    ? format(selected, formatPattern, locale ? { locale } : undefined)
    : ""
  const inputValue = draft ?? formattedValue
  const resolvedDefaultMonth = calendarProps?.defaultMonth ?? selected
  const resolvedLocale = locale ?? calendarProps?.locale
  const describedBy = [
    ariaDescribedBy,
    descriptionId,
    isInvalid ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ")

  const setInvalidReason = (
    reason: "format" | "unavailable" | null
  ) => {
    setParseError(reason)
    onInvalidChange?.(reason !== null)
  }

  const updateValue = (nextValue: Date | undefined) => {
    if (!isControlled) setUncontrolledValue(nextValue)
    setDraft(null)
    setInvalidReason(null)
    onValueChange?.(nextValue)
  }

  const commitInput = () => {
    const nextInput = inputValue.trim()

    if (!nextInput) {
      if (required) {
        setInvalidReason("format")
        return false
      }

      updateValue(undefined)
      return true
    }

    const parsedValue = parse(
      nextInput,
      formatPattern,
      new Date(),
      locale ? { locale } : undefined
    )
    const matchesFormat =
      isValid(parsedValue) &&
      format(parsedValue, formatPattern, locale ? { locale } : undefined) ===
        nextInput

    if (!matchesFormat) {
      setInvalidReason("format")
      return false
    }

    if (
      disabledMatchers &&
      dateMatchModifiers(parsedValue, disabledMatchers)
    ) {
      setInvalidReason("unavailable")
      return false
    }

    updateValue(parsedValue)
    return true
  }

  const handleCalendarSelect = (nextValue: Date | undefined) => {
    updateValue(nextValue)
    setOpen(false)
  }

  const resolvedError =
    errorMessage ??
    (parseError === "unavailable"
      ? "That date is unavailable."
      : `Enter a valid date in ${formatHint} format.`)

  return (
    <div
      data-slot="date-picker"
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      className={cn(
        "group/date-picker flex w-full min-w-0 flex-col gap-2",
        className
      )}
    >
      <label
        data-slot="date-picker-label"
        htmlFor={inputId}
        className="flex w-fit items-center gap-2 text-sm leading-none font-semibold tracking-[-0.01em] text-foreground select-none group-data-[disabled=true]/date-picker:pointer-events-none group-data-[disabled=true]/date-picker:opacity-50"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen} triggerId={triggerId}>
        <div
          data-slot="date-picker-control"
          data-filled={Boolean(selected) || undefined}
          className="group/date-picker-control flex min-h-11 w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-input bg-accent transition-[background-color,border-color,box-shadow] hover:border-[var(--afo-color-border-strong)] focus-within:border-ring focus-within:bg-card focus-within:shadow-[0_0_0_2px_var(--afo-color-neutral-chalk),0_0_0_4px_var(--afo-color-ink-void)] group-data-[invalid=true]/date-picker:border-destructive group-data-[invalid=true]/date-picker:bg-[var(--afo-danger-soft)] group-data-[disabled=true]/date-picker:cursor-not-allowed group-data-[disabled=true]/date-picker:bg-muted"
        >
          <input
            {...inputProps}
            ref={inputRef}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={inputValue}
            placeholder={placeholder ?? formatHint}
            required={required}
            readOnly={readOnly}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy || undefined}
            className="min-h-11 min-w-0 flex-1 appearance-none border-0 bg-transparent px-3.5 py-2 text-base font-medium tabular-nums text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground md:text-sm"
            onChange={(event) => {
              setDraft(event.target.value)
              if (parseError) setInvalidReason(null)
            }}
            onBlur={(event) => {
              commitInput()
              onBlur?.(event)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                commitInput()
              } else if (event.key === "Escape" && draft !== null) {
                event.preventDefault()
                setDraft(null)
                setInvalidReason(null)
              } else if (event.key === "ArrowDown" && event.altKey) {
                event.preventDefault()
                setOpen(true)
              }
              onKeyDown?.(event)
            }}
          />
          {selected && !disabled && !readOnly ? (
            <button
              type="button"
              data-slot="date-picker-clear"
              aria-label={clearLabel}
              className="grid size-11 shrink-0 place-items-center border-0 bg-transparent text-muted-foreground outline-none transition-[background-color,color] hover:bg-muted hover:text-foreground"
              onClick={() => {
                updateValue(undefined)
                inputRef.current?.focus()
              }}
            >
              <FoundationIcon name="close" size="sm" decorative />
            </button>
          ) : null}
          <PopoverTrigger
            render={
              <button
                id={triggerId}
                type="button"
                data-slot="date-picker-trigger"
                aria-label={openCalendarLabel}
                disabled={disabled || readOnly}
                className="grid size-11 shrink-0 place-items-center border-0 border-l border-border bg-transparent text-muted-foreground outline-none transition-[background-color,color] hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 group-data-[filled=true]/date-picker-control:text-foreground"
              />
            }
          >
            <FoundationIcon name="calendar" size="sm" decorative />
          </PopoverTrigger>
        </div>
        <PopoverContent
          align="start"
          collisionPadding={4}
          className="w-auto p-0"
        >
          <PopoverTitle className="sr-only">{calendarLabel}</PopoverTitle>
          <Calendar
            {...calendarProps}
            aria-label={calendarLabel}
            mode="single"
            onSelect={handleCalendarSelect}
            selected={selected}
            {...(resolvedDefaultMonth
              ? { defaultMonth: resolvedDefaultMonth }
              : {})}
            {...(resolvedLocale ? { locale: resolvedLocale } : {})}
          />
        </PopoverContent>
      </Popover>
      <p
        id={descriptionId}
        data-slot="date-picker-description"
        className="m-0 flex flex-wrap gap-x-1.5 text-sm leading-normal text-muted-foreground"
      >
        {description ? <span>{description}</span> : null}
        <span>Format: {formatHint}</span>
      </p>
      {isInvalid ? (
        <p
          id={errorId}
          role="alert"
          data-slot="date-picker-error"
          className="m-0 text-sm leading-normal font-semibold text-danger-text"
        >
          {resolvedError}
        </p>
      ) : null}
    </div>
  )
}

export { DatePicker }
export type { DatePickerCalendarProps, DatePickerProps }
