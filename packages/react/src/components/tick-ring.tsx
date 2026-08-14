import * as React from "react"

import { cn } from "../lib/utils.js"

type TickRingProps = Omit<React.ComponentProps<"div">, "role" | "aria-label"> & {
  /** Accessible name for the meter value. */
  "aria-label": string
  /** Progress from 0 to 100. */
  value: number
  /** Rendered size of the ring in pixels. */
  size?: number
  /** Stroke width in viewBox units (36 × 36). */
  strokeWidth?: number
}

function TickRing({
  className,
  value,
  size = 40,
  strokeWidth = 3.5,
  style,
  children,
  ...props
}: TickRingProps) {
  const progress = Math.min(100, Math.max(0, value))
  const announced = Math.round(progress)
  const radius = 18 - strokeWidth - 0.5

  return (
    <div
      data-slot="tick-ring"
      role="meter"
      aria-valuenow={announced}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${announced}%`}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center align-middle text-[var(--afo-color-text-accent)]",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        viewBox="0 0 36 36"
        width={size}
        height={size}
        className="block"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx={18}
          cy={18}
          r={radius}
          fill="none"
          stroke="var(--afo-color-border-subtle)"
          strokeWidth={strokeWidth}
          strokeDasharray="1.6 2.8"
        />
        <circle
          cx={18}
          cy={18}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          pathLength={100}
          strokeDasharray={`${progress} ${100 - progress}`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      {children != null && (
        <span
          data-slot="tick-ring-label"
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          {children}
        </span>
      )}
    </div>
  )
}

export { TickRing }
export type { TickRingProps }
