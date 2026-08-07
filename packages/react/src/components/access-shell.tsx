import * as React from "react"

import { cn } from "../lib/utils.js"

function AccessShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="access-shell"
      className={cn(
        "relative isolate min-h-svh overflow-hidden bg-background text-foreground",
        "before:absolute before:inset-0 before:-z-20 before:bg-[radial-gradient(circle_at_12%_12%,var(--afo-accent-soft),transparent_34%),linear-gradient(135deg,var(--background)_0%,var(--afo-color-background-canvas)_100%)] before:content-['']",
        "after:absolute after:top-[22%] after:-right-[18rem] after:-z-10 after:h-[28rem] after:w-[54rem] after:-rotate-12 after:rounded-[999px] after:bg-[image:var(--afo-gradient-accent)] after:opacity-20 after:content-['']",
        className,
      )}
      {...props}
    />
  )
}

function AccessHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="access-header"
      className={cn(
        "relative z-10 mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12",
        className,
      )}
      {...props}
    />
  )
}

function AccessMain({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="access-main"
      className={cn(
        "relative z-0 mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-10 sm:px-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8 lg:px-12 lg:pb-16",
        className,
      )}
      {...props}
    />
  )
}

function AccessHero({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="access-hero"
      className={cn(
        "min-w-0 py-6 lg:col-start-1 lg:row-start-1 lg:self-end lg:pt-14 lg:pb-0",
        className,
      )}
      {...props}
    />
  )
}

function AccessEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="access-eyebrow"
      className={cn(
        "m-0 mb-6 inline-flex items-center gap-3 text-xs font-extrabold tracking-[var(--afo-letter-spacing-eyebrow)] text-[var(--afo-color-text-accent)] uppercase after:h-px after:w-12 after:bg-primary after:content-['']",
        className,
      )}
      {...props}
    />
  )
}

function AccessTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="access-title"
      className={cn(
        "m-0 max-w-[10ch] text-balance font-display text-[clamp(4rem,8.6vw,8rem)] leading-[0.82] font-bold tracking-[-0.045em] uppercase",
        className,
      )}
      {...props}
    />
  )
}

function AccessDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="access-description"
      className={cn(
        "mt-7 mb-0 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
        className,
      )}
      {...props}
    />
  )
}

function AccessJourney({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="access-journey"
      className={cn(
        "m-0 grid max-w-2xl list-none grid-cols-1 border-y border-border p-0 sm:grid-cols-3 lg:col-start-1 lg:row-start-2 lg:self-start",
        className,
      )}
      {...props}
    />
  )
}

function AccessJourneyStep({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="access-journey-step"
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-3 border-t border-border py-4 first:border-t-0 sm:block sm:border-t-0 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0",
        className,
      )}
      {...props}
    />
  )
}

function AccessJourneyIndex({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="access-journey-index"
      aria-hidden="true"
      className={cn(
        "font-display text-3xl leading-none font-semibold text-[var(--afo-color-text-accent)] tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

function AccessJourneyLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="access-journey-label"
      className={cn(
        "block text-xs leading-snug font-extrabold tracking-[var(--afo-letter-spacing-utility)] uppercase",
        className,
      )}
      {...props}
    />
  )
}

function AccessPanel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="access-panel"
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-[var(--afo-color-border-strong)] bg-[var(--afo-color-ink-panel)] p-6 text-[var(--afo-color-neutral-white)] shadow-[var(--afo-shadow-workspace)] sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:p-10",
        "before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-[image:var(--afo-gradient-accent)] before:content-['']",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(color-mix(in_srgb,var(--afo-color-neutral-white)_12%,transparent)_1px,transparent_1px)] after:bg-[size:8px_8px] after:content-[''] after:[mask-image:linear-gradient(125deg,transparent_58%,black_100%)]",
        className,
      )}
      {...props}
    />
  )
}

function AccessPanelHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="access-panel-header"
      className={cn("relative z-[1]", className)}
      {...props}
    />
  )
}

function AccessPanelEyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="access-panel-eyebrow"
      className={cn(
        "m-0 text-xs font-extrabold tracking-[var(--afo-letter-spacing-eyebrow)] text-[var(--afo-color-brand-primary)] uppercase",
        className,
      )}
      {...props}
    />
  )
}

function AccessPanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="access-panel-title"
      className={cn(
        "mt-3 mb-0 max-w-[12ch] text-balance font-display text-5xl leading-[0.9] font-bold tracking-[-0.025em] uppercase sm:text-6xl",
        className,
      )}
      {...props}
    />
  )
}

function AccessPanelDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="access-panel-description"
      className={cn(
        "mt-5 mb-0 max-w-md text-sm leading-relaxed text-[var(--afo-color-neutral-steel)] sm:text-base",
        className,
      )}
      {...props}
    />
  )
}

function AccessPanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="access-panel-content"
      className={cn("relative z-[1] mt-8 flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function AccessPanelAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="access-panel-action"
      className={cn(
        "flex flex-col [&_[data-slot=button]]:w-full [&_[data-slot=button]]:no-underline",
        className,
      )}
      {...props}
    />
  )
}

function AccessPanelNote({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="access-panel-note"
      className={cn(
        "relative z-[1] mt-8 mb-0 flex items-start gap-3 border-t border-[color-mix(in_srgb,var(--afo-color-neutral-white)_14%,transparent)] pt-5 text-sm leading-relaxed text-[var(--afo-color-neutral-steel)] [&_svg]:mt-0.5 [&_svg]:shrink-0 [&_svg]:text-[var(--afo-color-brand-primary)]",
        className,
      )}
      {...props}
    />
  )
}

export {
  AccessDescription,
  AccessEyebrow,
  AccessHeader,
  AccessHero,
  AccessJourney,
  AccessJourneyIndex,
  AccessJourneyLabel,
  AccessJourneyStep,
  AccessMain,
  AccessPanel,
  AccessPanelAction,
  AccessPanelContent,
  AccessPanelDescription,
  AccessPanelEyebrow,
  AccessPanelHeader,
  AccessPanelNote,
  AccessPanelTitle,
  AccessShell,
  AccessTitle,
}
