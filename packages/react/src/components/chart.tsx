"use client"

import * as React from "react"
import {
  Area,
  AreaChart as AreaPlot,
  Bar,
  BarChart as BarPlot,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import { cn } from "../lib/utils.js"

/*
 * Charts for a product screen: a trend over time (`AreaChart`) and a
 * comparison across a few named positions (`BarChart`). They are deliberately
 * closed: a product passes data and words, never marks, colours or axes, so
 * every chart in every product is drawn the same way.
 *
 * **One signal and its context.** Ink & Signal lets cyan be the only thing
 * that speaks, and a chart keeps that: the first series wears the signal
 * (`--chart-1`), the second wears ink (`--chart-2`). The pair is told apart by
 * lightness as much as by hue, so it holds without colour vision. There is no
 * third colour, and the `series` type stops at two; a third thing to compare
 * is a second chart.
 *
 * **A missing value is a gap.** A null, undefined or non-finite number draws
 * nothing: the line breaks and the bar is absent. It is never drawn as zero,
 * because "nothing was measured" and "it measured zero" are different facts
 * and only one of them is the reader's business to worry about. With no data
 * at all the chart renders nothing, and the product says why in its place.
 *
 * **Every value is also text.** The plot is one way to read the data and the
 * table under it is the other: same rows, same words, for whoever does not
 * see the plot. The tooltip repeats values on hover and on the arrow keys; it
 * never holds one that the table does not.
 *
 * Marks follow one spec: 2px lines, 8px markers ringed in the surface, bars
 * capped at 24px with a 4px data end and a 2px gap, solid hairline grid.
 * Nothing animates: a chart on a work screen is read, not watched.
 */

const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)"] as const
const SURFACE = "var(--card)"
const DEFAULT_HEIGHT = 224
const MISSING = "—"

type ChartDatum = Record<string, string | number | null | undefined>
type ChartKey<Datum extends ChartDatum> = Extract<keyof Datum, string>

type ChartSeries<Datum extends ChartDatum> = {
  /** Field of each datum that holds this series' number. */
  key: ChartKey<Datum>
  /** Its name in the legend, the tooltip and the table. */
  label: string
}

type ChartProps<Datum extends ChartDatum> = Omit<
  React.ComponentProps<"figure">,
  "children" | "aria-label"
> & {
  /** Accessible name: what is plotted. Also the caption of the table view. */
  "aria-label": string
  /** One datum per position along the axis, in reading order. */
  data: readonly Datum[]
  /** Field that names each position: a week, a month. Shown on the axis. */
  index: ChartKey<Datum>
  /** Heading of that field in the table view. */
  indexLabel: string
  /** The signal first, then its context. Two at most. */
  series:
    | readonly [ChartSeries<Datum>]
    | readonly [ChartSeries<Datum>, ChartSeries<Datum>]
  /** Formats a value for the axis, and for the rest unless `describeValue` does. */
  formatValue?: (value: number) => string
  /** Says more than the axis has room for, in the tooltip and the table. */
  describeValue?: (
    value: number,
    datum: Datum,
    series: ChartSeries<Datum>
  ) => string
  /** A longer name for a position, in the tooltip and the table. */
  formatIndex?: (index: string, datum: Datum) => string
  /** What the tooltip and the table say where a value is missing. */
  missingLabel?: string
  /** Fixed value range, for a scale with known ends such as a percentage. */
  domain?: readonly [number, number]
  /** Height of the plot in pixels. */
  height?: number
}

type ChartKind = "area" | "bar"

function numberAt<Datum extends ChartDatum>(datum: Datum, key: ChartKey<Datum>) {
  const value = datum[key]
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function Chart<Datum extends ChartDatum>({
  kind,
  className,
  data,
  index,
  indexLabel,
  series,
  formatValue = String,
  describeValue,
  formatIndex,
  missingLabel = MISSING,
  domain,
  height = DEFAULT_HEIGHT,
  "aria-label": label,
  ...props
}: ChartProps<Datum> & { kind: ChartKind }) {
  // One colour per series, in order. The type stops at two; pairing from the
  // palette is what holds a caller that got past the type.
  const plotted = SERIES_COLORS.flatMap((color, position) => {
    const item = series[position]
    return item ? [{ item, color }] : []
  })
  // A gap is a null to the plot, whatever the datum held in its place.
  const rows = data.map((datum) => {
    const row: Record<string, string | number | null> = {
      [index]: String(datum[index] ?? ""),
    }
    for (const { item } of plotted) row[item.key] = numberAt(datum, item.key)
    return row
  })

  const indexText = (datum: Datum) => {
    const raw = String(datum[index] ?? "")
    return formatIndex ? formatIndex(raw, datum) : raw
  }
  const valueText = (datum: Datum, item: ChartSeries<Datum>) => {
    const value = numberAt(datum, item.key)
    if (value === null) return missingLabel
    return describeValue ? describeValue(value, datum, item) : formatValue(value)
  }

  // The key beside a name is the mark it names: a square for a bar, a stroke
  // for a line. The legend and the tooltip draw the same one.
  const swatch = (color: string) => (
    <span
      aria-hidden="true"
      data-slot="chart-swatch"
      className={cn(
        "shrink-0",
        kind === "bar"
          ? "size-2.5 rounded-[var(--afo-radius-xs)]"
          : "h-0.5 w-3 rounded-full"
      )}
      style={{ background: color }}
    />
  )

  const renderTooltip = ({ active, activeIndex }: TooltipContentProps) => {
    const datum = activeIndex == null ? undefined : data[Number(activeIndex)]
    if (!active || !datum) return null

    // A status, so the arrow keys read each position out as they reach it.
    return (
      <div
        data-slot="chart-tooltip"
        role="status"
        aria-live="assertive"
        className="grid min-w-36 gap-1.5 rounded-[var(--afo-radius-control)] border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-[var(--afo-shadow-card)]"
      >
        <span className="text-muted-foreground">{indexText(datum)}</span>
        <ul role="list" className="grid gap-1">
          {plotted.map(({ item, color }) => (
            <li key={item.key} className="flex items-center gap-2">
              {plotted.length > 1 ? (
                <>
                  {swatch(color)}
                  <span className="text-muted-foreground">{item.label}</span>
                </>
              ) : null}
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  plotted.length > 1 && "ml-auto pl-3"
                )}
              >
                {valueText(datum, item)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const axes = (
    <>
      <CartesianGrid vertical={false} stroke="var(--border)" />
      <XAxis
        dataKey={index}
        axisLine={false}
        tickLine={false}
        tickMargin={8}
        minTickGap={8}
        interval="preserveStartEnd"
        tick={{ fill: "var(--muted-foreground)" }}
        {...(kind === "area" ? { padding: { left: 12, right: 12 } } : {})}
      />
      <YAxis
        width="auto"
        axisLine={false}
        tickLine={false}
        tickMargin={8}
        tickCount={3}
        // Every tick sits on its grid line; the default nudges the end ones.
        interval={0}
        allowDecimals={false}
        tickFormatter={(value: number) => formatValue(value)}
        tick={{ fill: "var(--muted-foreground)" }}
        {...(domain ? { domain: [domain[0], domain[1]] } : {})}
      />
    </>
  )
  // Top room for half a tick label, so the highest one is not cut.
  const margin = { top: 10, right: 8, bottom: 0, left: 0 }

  // Empty axes say nothing. Why there is no data is the product's to say.
  if (data.length === 0) return null

  return (
    <figure
      data-slot="chart"
      data-chart={kind}
      aria-label={label}
      className={cn("m-0 grid min-w-0 gap-3", className)}
      {...props}
    >
      {plotted.length > 1 ? (
        <ul
          role="list"
          data-slot="chart-legend"
          className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
        >
          {plotted.map(({ item, color }) => (
            <li key={item.key} className="flex items-center gap-1.5">
              {swatch(color)}
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Padded out by what it is pulled back, so the focus ring clears the
          axis labels without moving the drawing. */}
      <div
        data-slot="chart-plot"
        className="-m-1 min-w-0 p-1 text-xs tabular-nums"
      >
        {/* No guessed first size: the plot draws once it knows its width, so
            the axis never sizes itself against a drawing of another size. */}
        <ResponsiveContainer width="100%" height={height}>
          {kind === "area" ? (
            <AreaPlot data={rows} margin={margin} title={label}>
              {axes}
              <Tooltip
                content={renderTooltip}
                // A gap still has something to say: that nothing was measured.
                filterNull={false}
                cursor={{ stroke: "var(--afo-color-border-default)", strokeWidth: 1 }}
                isAnimationActive={false}
              />
              {plotted.map(({ item, color }) => (
                <Area
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  type="linear"
                  stroke={color}
                  strokeWidth={2}
                  fill={color}
                  fillOpacity={0.1}
                  connectNulls={false}
                  dot={{
                    r: 4,
                    fill: color,
                    fillOpacity: 1,
                    stroke: SURFACE,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: color,
                    stroke: SURFACE,
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
              ))}
            </AreaPlot>
          ) : (
            <BarPlot
              data={rows}
              margin={margin}
              barGap={2}
              barCategoryGap="28%"
              title={label}
            >
              {axes}
              <Tooltip
                content={renderTooltip}
                // A gap still has something to say: that nothing was measured.
                filterNull={false}
                cursor={{ fill: "var(--afo-color-accent-tonal)", stroke: "none" }}
                isAnimationActive={false}
              />
              {plotted.map(({ item, color }) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                  isAnimationActive={false}
                />
              ))}
            </BarPlot>
          )}
        </ResponsiveContainer>
      </div>

      {/* Hidden by a block around the table, never on the table: a table
          ignores a width under its content's, so its own box stayed as wide
          as its longest row. Free to wrap, it also stays inside a phone. */}
      <div className="sr-only">
        <table data-slot="chart-table" className="whitespace-normal">
          <caption>{label}</caption>
          <thead>
            <tr>
              <th scope="col">{indexLabel}</th>
              {plotted.map(({ item }) => (
                <th key={item.key} scope="col">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((datum, position) => (
              <tr key={position}>
                <th scope="row">{indexText(datum)}</th>
                {plotted.map(({ item }) => (
                  <td key={item.key}>{valueText(datum, item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

/**
 * A trend over time: one value per week, month or day, joined by a line over a
 * faint wash. The line breaks where a value is missing.
 */
function AreaChart<Datum extends ChartDatum>(props: ChartProps<Datum>) {
  return <Chart kind="area" {...props} />
}

/**
 * A comparison across a few named positions, one or two bars at each. A bar is
 * absent where its value is missing.
 */
function BarChart<Datum extends ChartDatum>(props: ChartProps<Datum>) {
  return <Chart kind="bar" {...props} />
}

export { AreaChart, BarChart }
export type { ChartDatum, ChartProps, ChartSeries }
