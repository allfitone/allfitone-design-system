import * as React from "react"

import { cn } from "../lib/utils.js"

function StatStrip({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-strip"
      className={cn(
        "flex overflow-hidden rounded-[var(--afo-radius-card)] bg-card text-card-foreground shadow-[var(--afo-shadow-card)]",
        className
      )}
      {...props}
    />
  )
}

type StatStripItemProps = React.ComponentProps<"div"> & {
  value?: React.ReactNode
  label?: React.ReactNode
}

function StatStripItem({
  className,
  value,
  label,
  children,
  ...props
}: StatStripItemProps) {
  return (
    <div
      data-slot="stat-strip-item"
      className={cn(
        "min-w-0 flex-1 border-l border-border px-1.5 py-[11px] text-center first:border-l-0",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <div
            data-slot="stat-strip-value"
            className="font-display text-2xl leading-none font-bold tabular-nums"
          >
            {value}
          </div>
          <div
            data-slot="stat-strip-label"
            className="mt-1 text-[0.6rem] font-extrabold tracking-[0.12em] uppercase text-muted-foreground"
          >
            {label}
          </div>
        </>
      )}
    </div>
  )
}

export { StatStrip, StatStripItem }
export type { StatStripItemProps }
