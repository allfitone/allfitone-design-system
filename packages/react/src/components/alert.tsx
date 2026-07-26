import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"

type AlertVariant = "info" | "success" | "warning" | "danger"
type AlertLive = "off" | "polite" | "assertive"

const alertVariants = cva(
  "group/alert relative grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 overflow-hidden rounded-xl border border-border bg-card p-4 pl-5 text-card-foreground shadow-[var(--afo-control-shadow)] before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r-full before:content-['']",
  {
    variants: {
      variant: {
        info: "before:bg-info",
        success: "before:bg-success",
        warning: "before:bg-warning",
        danger: "before:bg-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const variantIcon = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "error",
} as const

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode
    live?: AlertLive
  }

function Alert({
  "aria-atomic": ariaAtomic,
  "aria-live": ariaLive,
  children,
  className,
  icon,
  live = "off",
  role,
  variant = "info",
  ...props
}: AlertProps) {
  const resolvedVariant = variant ?? "info"
  const resolvedRole =
    role ??
    (live === "assertive"
      ? "alert"
      : live === "polite"
        ? "status"
        : undefined)
  const resolvedAriaLive =
    ariaLive ?? (live === "off" ? undefined : live)

  return (
    <div
      data-slot="alert"
      data-variant={resolvedVariant}
      data-live={live}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
      aria-atomic={ariaAtomic ?? (live === "off" ? undefined : true)}
      className={cn(
        alertVariants({ variant: resolvedVariant }),
        className
      )}
      {...props}
    >
      <div
        data-slot="alert-icon"
        className="row-span-2 mt-px grid size-9 shrink-0 place-items-center rounded-lg rounded-tr-sm border border-border bg-muted text-foreground group-data-[variant=danger]/alert:border-destructive/35 group-data-[variant=danger]/alert:bg-[var(--afo-danger-soft)] group-data-[variant=info]/alert:border-info/35 group-data-[variant=info]/alert:bg-[var(--afo-info-soft)] group-data-[variant=success]/alert:border-success/35 group-data-[variant=success]/alert:bg-[var(--afo-success-soft)] group-data-[variant=warning]/alert:border-warning/35 group-data-[variant=warning]/alert:bg-[var(--afo-warning-soft)] [&>svg]:size-5"
      >
        {icon ?? (
          <FoundationIcon
            name={variantIcon[resolvedVariant]}
            decorative
          />
        )}
      </div>
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 min-w-0 text-sm leading-snug font-bold tracking-[-0.015em]",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 min-w-0 text-sm leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-start-2 mt-2 flex min-w-0 flex-wrap items-center gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  alertVariants,
}
export type { AlertLive, AlertProps, AlertVariant }
