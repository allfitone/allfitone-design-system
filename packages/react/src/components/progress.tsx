"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "../lib/utils.js"

type ProgressVariant = "full" | "compact"

type ProgressProps = ProgressPrimitive.Root.Props & {
  variant?: ProgressVariant
}

function Progress({
  className,
  variant = "full",
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={variant}
      className={cn(
        "group/progress flex w-full min-w-0 flex-col gap-2.5",
        variant === "compact" && "gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function ProgressHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="progress-header"
      className={cn(
        "flex min-w-0 items-start justify-between gap-4",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({
  className,
  ...props
}: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn(
        "min-w-0 text-sm leading-snug font-semibold text-foreground group-data-[variant=compact]/progress:text-xs",
        className
      )}
      {...props}
    />
  )
}

function ProgressValue({
  children,
  className,
  ...props
}: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn(
        "shrink-0 font-display text-base leading-none font-bold tracking-[0.03em] text-foreground tabular-nums group-data-[variant=compact]/progress:text-xs",
        className
      )}
      {...props}
    >
      {children ??
        ((formattedValue, value) =>
          value == null ? "In progress" : formattedValue)}
    </ProgressPrimitive.Value>
  )
}

function ProgressTrack({
  className,
  ...props
}: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full border border-border bg-[var(--afo-control-surface)] shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--foreground)_8%,transparent)] group-data-[variant=compact]/progress:h-1.5",
        className
      )}
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "relative h-full rounded-full bg-[image:var(--afo-gradient-accent)] transition-[width] duration-300 ease-out after:absolute after:inset-y-0 after:end-0 after:w-0.5 after:bg-[var(--afo-color-accent-on-accent)] after:opacity-70 after:content-[''] data-[indeterminate]:absolute data-[indeterminate]:w-[38%]",
        className
      )}
      {...props}
    />
  )
}

function ProgressDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="progress-description"
      className={cn(
        "text-xs leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Progress,
  ProgressDescription,
  ProgressHeader,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
}
export type { ProgressProps, ProgressVariant }
