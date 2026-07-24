import * as React from "react"

import { cn } from "../lib/utils.js"

function AccentBlock({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accent-block"
      className={cn(
        "relative overflow-hidden rounded-[var(--afo-radius-card)] bg-[image:var(--afo-gradient-accent)] p-4 text-[var(--afo-color-accent-on-accent)]",
        // Dot texture revealed on the top-right diagonal, exactly as the
        // Ink & Signal reference (.accentb::after).
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(color-mix(in_srgb,var(--afo-color-accent-on-accent)_16%,transparent)_1px,transparent_1px)] after:bg-[size:7px_7px] after:content-[''] after:[mask-image:linear-gradient(115deg,transparent_55%,black_100%)]",
        // Interactive children stay above the texture. The ink-on-signal
        // inversion (.pill-ink) lives in globals.css @layer components,
        // where it can win over the gradient CTA rule.
        "[&_[data-slot=button]]:relative [&_[data-slot=button]]:z-[1]",
        className
      )}
      {...props}
    />
  )
}

function AccentBlockLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accent-block-label"
      className={cn(
        "text-xs font-extrabold tracking-[var(--afo-letter-spacing-utility)] uppercase text-[var(--afo-color-accent-on-accent-muted)]",
        className
      )}
      {...props}
    />
  )
}

function AccentBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accent-block-title"
      className={cn(
        "font-display mt-1 mb-0.5 text-2xl leading-[0.95] font-bold uppercase",
        className
      )}
      {...props}
    />
  )
}

function AccentBlockMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accent-block-meta"
      className={cn(
        "text-xs font-semibold text-[var(--afo-color-accent-on-accent-muted)]",
        className
      )}
      {...props}
    />
  )
}

export { AccentBlock, AccentBlockLabel, AccentBlockTitle, AccentBlockMeta }
