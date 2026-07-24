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
        // Interactive children stay above the texture and invert to ink-on-signal
        // (reference .pill-ink: the CTA must contrast against the cyan block,
        // not blend into it).
        "[&_[data-slot=button]]:relative [&_[data-slot=button]]:z-[1] [&_[data-slot=button]]:[background:var(--afo-color-ink-on-signal)] [&_[data-slot=button]]:text-[var(--afo-color-brand-light)] [&_[data-slot=button]]:shadow-none",
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
        "text-[0.625rem] font-extrabold tracking-[0.16em] uppercase text-[var(--afo-color-accent-on-accent-muted)]",
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
