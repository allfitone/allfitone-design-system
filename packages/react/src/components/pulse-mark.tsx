import * as React from "react"

import { cn } from "../lib/utils.js"

type PulseMarkProps = Omit<React.ComponentProps<"svg">, "width" | "height"> & {
  /** Rendered width in pixels; height keeps the 34 × 14 ratio. */
  width?: number
  /** Accessible name. When set, the mark is exposed as role="img". */
  label?: string
}

function PulseMark({ className, width = 26, label, ...props }: PulseMarkProps) {
  return (
    <svg
      data-slot="pulse-mark"
      viewBox="0 0 34 14"
      width={width}
      height={(width * 14) / 34}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn(
        "inline-block shrink-0 align-middle text-[var(--afo-color-text-accent)]",
        className
      )}
      {...props}
    >
      <path
        d="M1 8h6l3-6 4 10 3-7 2 3h14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { PulseMark }
export type { PulseMarkProps }
