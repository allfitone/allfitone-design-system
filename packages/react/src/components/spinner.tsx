import type { ComponentProps } from "react"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"

type SpinnerProps = ComponentProps<"span"> & {
  label?: string
}

function Spinner({ className, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn("inline-flex size-4 animate-spin items-center justify-center", className)}
      {...props}
    >
      <FoundationIcon name="loading" size="sm" decorative />
    </span>
  )
}

export { Spinner }
export type { SpinnerProps }
