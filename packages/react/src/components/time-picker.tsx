"use client"

import * as React from "react"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js"

/**
 * A time of day as `HH:MM` on a 24-hour clock, such as `06:05` or `18:30`.
 * It carries no date and no timezone; the product combines it with both.
 */
type TimeValue = string

type TimePickerProps = Omit<
  React.ComponentProps<"input">,
  | "children"
  | "defaultValue"
  | "onChange"
  | "step"
  | "type"
  | "value"
> & {
  clearLabel?: string
  defaultValue?: TimeValue | undefined
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  formatHint?: string
  /** Names the visible format, as in `Format: HH:MM`. */
  formatLabel?: string
  invalid?: boolean
  label: React.ReactNode
  listLabel?: string
  onInvalidChange?: (invalid: boolean) => void
  onValueChange?: (value: TimeValue | undefined) => void
  openListLabel?: string
  /** Minutes between the times the list offers. Typed times need not fall on it. */
  step?: number
  value?: TimeValue | undefined
}

const MINUTES_PER_DAY = 24 * 60
const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/

const hasOwn = (value: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(value, key)

const pad = (value: number) => String(value).padStart(2, "0")

function formatTime(minutes: number): TimeValue {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
}

/** The minutes since midnight of a typed time, or `null` when it is not one. */
function parseTime(input: string): number | null {
  const match = TIME_PATTERN.exec(input.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

/** The step in minutes, or the default when it cannot divide a day into a list. */
function listInterval(step: number) {
  return Number.isInteger(step) && step > 0 && step <= MINUTES_PER_DAY ? step : 30
}

function listedTimes(interval: number): TimeValue[] {
  const times: TimeValue[] = []
  for (let minutes = 0; minutes < MINUTES_PER_DAY; minutes += interval) {
    times.push(formatTime(minutes))
  }
  return times
}

/** The listed time to start from: the selected one, else the last one before it. */
function startingIndex(times: TimeValue[], selected: TimeValue | undefined) {
  const target = selected ? parseTime(selected) : null
  if (target === null) return 0
  let index = 0
  times.forEach((time, position) => {
    if ((parseTime(time) ?? 0) <= target) index = position
  })
  return index
}

function TimePicker(props: TimePickerProps) {
  const {
    "aria-describedby": ariaDescribedBy,
    className,
    clearLabel = "Clear time",
    defaultValue,
    description,
    disabled,
    errorMessage,
    formatHint = "HH:MM",
    formatLabel = "Format",
    id: providedId,
    invalid = false,
    label,
    listLabel = "Choose a time",
    onBlur,
    onInvalidChange,
    onKeyDown,
    onValueChange,
    openListLabel = "Open time list",
    placeholder,
    readOnly,
    required,
    step = 30,
    value,
    ...inputProps
  } = props
  const generatedId = React.useId()
  const inputId = providedId ?? `time-picker-${generatedId}`
  const triggerId = `${inputId}-trigger`
  const listId = `${inputId}-list`
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`
  const isControlled = hasOwn(props, "value")
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [draft, setDraft] = React.useState<string | null>(null)
  const [parseError, setParseError] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement | null>(null)
  // The popup mounts the list after `open` changes, so scrolling waits for the node.
  const [listNode, setListNode] = React.useState<HTMLDivElement | null>(null)
  const attachList = React.useCallback((node: HTMLDivElement | null) => {
    listRef.current = node
    setListNode(node)
  }, [])
  const selected = isControlled ? value : uncontrolledValue
  const interval = listInterval(step)
  const times = React.useMemo(() => listedTimes(interval), [interval])
  const isInvalid = invalid || parseError
  const inputValue = draft ?? selected ?? ""
  const optionId = (index: number) => `${listId}-${index}`
  const describedBy = [
    ariaDescribedBy,
    descriptionId,
    isInvalid ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ")

  const setInvalid = (next: boolean) => {
    setParseError(next)
    onInvalidChange?.(next)
  }

  const updateValue = (nextValue: TimeValue | undefined) => {
    if (!isControlled) setUncontrolledValue(nextValue)
    setDraft(null)
    setInvalid(false)
    onValueChange?.(nextValue)
  }

  const commitInput = () => {
    const nextInput = inputValue.trim()

    if (!nextInput) {
      if (required) {
        setInvalid(true)
        return
      }
      updateValue(undefined)
      return
    }

    const minutes = parseTime(nextInput)
    if (minutes === null) {
      setInvalid(true)
      return
    }
    updateValue(formatTime(minutes))
  }

  const openList = (nextOpen: boolean) => {
    if (nextOpen) setActiveIndex(startingIndex(times, selected))
    setOpen(nextOpen)
  }

  const choose = (index: number) => {
    const time = times[index]
    if (time === undefined) return
    updateValue(time)
    setOpen(false)
  }

  React.useEffect(() => {
    const option = listNode?.children[activeIndex]
    if (!listNode || !(option instanceof HTMLElement)) return
    // Scroll the list only: scrollIntoView would also move the page.
    const top = option.offsetTop
    const bottom = top + option.offsetHeight
    if (top < listNode.scrollTop) listNode.scrollTop = top
    else if (bottom > listNode.scrollTop + listNode.clientHeight) {
      listNode.scrollTop = bottom - listNode.clientHeight
    }
  }, [activeIndex, listNode])

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const perHour = Math.max(1, Math.floor(60 / interval))
    const last = times.length - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(activeIndex + 1, last),
      ArrowUp: Math.max(activeIndex - 1, 0),
      PageDown: Math.min(activeIndex + perHour, last),
      PageUp: Math.max(activeIndex - perHour, 0),
      Home: 0,
      End: last,
    }
    const next = moves[event.key]
    if (next !== undefined) {
      event.preventDefault()
      setActiveIndex(next)
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      choose(activeIndex)
    }
  }

  return (
    <div
      data-slot="time-picker"
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      className={cn(
        "group/time-picker flex w-full min-w-0 flex-col gap-2",
        className
      )}
    >
      <label
        data-slot="time-picker-label"
        htmlFor={inputId}
        className="flex w-fit items-center gap-2 text-sm leading-none font-semibold tracking-[-0.01em] text-foreground select-none group-data-[disabled=true]/time-picker:pointer-events-none group-data-[disabled=true]/time-picker:opacity-50"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={openList} triggerId={triggerId}>
        <div
          data-slot="time-picker-control"
          data-filled={Boolean(selected) || undefined}
          className="group/time-picker-control flex min-h-11 w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-input bg-accent transition-[background-color,border-color,box-shadow] hover:border-[var(--afo-color-border-strong)] focus-within:border-ring focus-within:bg-card focus-within:shadow-[0_0_0_2px_var(--afo-color-neutral-chalk),0_0_0_4px_var(--afo-color-ink-void)] group-data-[invalid=true]/time-picker:border-destructive group-data-[invalid=true]/time-picker:bg-[var(--afo-danger-soft)] group-data-[disabled=true]/time-picker:cursor-not-allowed group-data-[disabled=true]/time-picker:bg-muted"
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
              if (parseError) setInvalid(false)
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
                setInvalid(false)
              } else if (event.key === "ArrowDown" && event.altKey) {
                event.preventDefault()
                openList(true)
              }
              onKeyDown?.(event)
            }}
          />
          {selected && !disabled && !readOnly ? (
            <button
              type="button"
              data-slot="time-picker-clear"
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
                data-slot="time-picker-trigger"
                aria-label={openListLabel}
                disabled={disabled || readOnly}
                className="grid size-11 shrink-0 place-items-center border-0 border-l border-border bg-transparent text-muted-foreground outline-none transition-[background-color,color] hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 group-data-[filled=true]/time-picker-control:text-foreground"
              />
            }
          >
            <FoundationIcon name="time" size="sm" decorative />
          </PopoverTrigger>
        </div>
        <PopoverContent
          align="start"
          collisionPadding={4}
          initialFocus={listRef}
          className="w-44 gap-0 p-1"
        >
          <PopoverTitle className="sr-only">{listLabel}</PopoverTitle>
          <div
            ref={attachList}
            id={listId}
            role="listbox"
            tabIndex={0}
            aria-label={listLabel}
            aria-activedescendant={optionId(activeIndex)}
            data-slot="time-picker-list"
            className="relative max-h-72 overflow-y-auto rounded-lg outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--afo-color-border-focus)]"
            onKeyDown={handleListKeyDown}
          >
            {times.map((time, index) => {
              const isSelected = time === selected
              return (
                <div
                  key={time}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  data-slot="time-picker-option"
                  data-highlighted={index === activeIndex || undefined}
                  data-selected={isSelected || undefined}
                  className="relative flex min-h-11 cursor-default items-center rounded-lg py-2 pr-9 pl-3 text-sm font-medium tabular-nums select-none hover:bg-accent data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-[var(--afo-accent-soft)]"
                  onClick={() => choose(index)}
                  onPointerMove={() => {
                    if (index !== activeIndex) setActiveIndex(index)
                  }}
                >
                  {time}
                  {isSelected ? (
                    <FoundationIcon
                      name="check"
                      size="sm"
                      decorative
                      className="absolute right-3"
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      <p
        id={descriptionId}
        data-slot="time-picker-description"
        className="m-0 flex flex-wrap gap-x-1.5 text-sm leading-normal text-muted-foreground"
      >
        {description ? <span>{description}</span> : null}
        <span>
          {formatLabel}: {formatHint}
        </span>
      </p>
      {isInvalid ? (
        <p
          id={errorId}
          role="alert"
          data-slot="time-picker-error"
          className="m-0 text-sm leading-normal font-semibold text-danger-text"
        >
          {errorMessage ?? `Enter a valid time in ${formatHint} format.`}
        </p>
      ) : null}
    </div>
  )
}

export { TimePicker }
export type { TimePickerProps, TimeValue }
