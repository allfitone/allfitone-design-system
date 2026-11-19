import * as React from "react"

import { cn } from "../lib/utils.js"

/*
 * A ranked list drawn as bars: one named row per thing counted, its figure in
 * words and a bar under it. Use it where the reader compares a handful of
 * named things (clients per coach, members per plan) and the names matter as
 * much as the sizes.
 *
 * It is a list, not a chart. The name and the figure are text, so the row
 * reads the same with the bar removed, which is why the bar is hidden from
 * assistive technology and no table view is needed beside it.
 *
 * Bars share one baseline and one scale, the largest value listed unless `max`
 * states another. There is no track behind them: a track says "out of a
 * limit", and a count has none. A zero draws nothing and keeps its row.
 */

type BarListItem = {
  /** Stable identity of the row. */
  id: string
  /** What the row counts: a person, a plan, a place. */
  label: React.ReactNode
  value: number
}

type BarListProps = Omit<React.ComponentProps<"ol">, "children" | "aria-label"> & {
  /** Accessible name: what the list measures. */
  "aria-label": string
  /** Rows in the order they should be read. The list does not sort them. */
  items: readonly BarListItem[]
  /** Turns a value into the figure at the end of its row. */
  formatValue?: (value: number) => React.ReactNode
  /** The value a full bar stands for. Defaults to the largest value listed. */
  max?: number
}

function BarList({
  className,
  items,
  formatValue = String,
  max,
  ...props
}: BarListProps) {
  if (items.length === 0) return null

  const ceiling = max ?? Math.max(...items.map((item) => item.value))

  return (
    <ol data-slot="bar-list" className={cn("grid gap-3", className)} {...props}>
      {items.map((item) => {
        const share =
          ceiling > 0 ? Math.min(1, Math.max(0, item.value / ceiling)) : 0

        return (
          <li
            key={item.id}
            data-slot="bar-list-item"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1.5"
          >
            <span
              data-slot="bar-list-label"
              className="min-w-0 text-sm wrap-anywhere"
            >
              {item.label}
            </span>
            <span
              data-slot="bar-list-value"
              className="text-sm font-semibold tabular-nums"
            >
              {formatValue(item.value)}
            </span>
            <span
              data-slot="bar-list-track"
              aria-hidden="true"
              className="col-span-full block h-2"
            >
              <span
                data-slot="bar-list-bar"
                className="block h-full rounded-r-[var(--afo-radius-sm)] bg-chart-1"
                style={{ width: `${share * 100}%` }}
              />
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export { BarList }
export type { BarListItem, BarListProps }
