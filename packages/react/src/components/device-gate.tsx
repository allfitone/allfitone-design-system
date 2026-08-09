import * as React from "react";

import { cn } from "../lib/utils.js";

function DeviceGate({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="device-gate"
      className={cn("min-h-svh", className)}
      {...props}
    />
  );
}

function DeviceGateContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="device-gate-content" className={cn(className)} {...props} />
  );
}

function DeviceGateFallback({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="device-gate-fallback"
      className={cn(
        "relative isolate min-h-svh overflow-hidden bg-background text-foreground",
        "before:absolute before:inset-0 before:-z-20 before:bg-[radial-gradient(circle_at_16%_12%,var(--afo-accent-soft),transparent_38%),linear-gradient(145deg,var(--background)_0%,var(--afo-color-background-canvas)_100%)] before:content-['']",
        "after:absolute after:top-[44%] after:-right-40 after:-z-10 after:h-40 after:w-[32rem] after:-rotate-12 after:rounded-[999px] after:bg-[image:var(--afo-gradient-accent)] after:opacity-20 after:content-['']",
        className
      )}
      {...props}
    />
  );
}

function DeviceGateHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="device-gate-header"
      className={cn(
        "relative z-10 mx-auto flex min-h-20 w-full max-w-2xl items-center justify-between gap-4 px-5",
        className
      )}
      {...props}
    />
  );
}

function DeviceGateMain({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="device-gate-main"
      className={cn(
        "relative z-10 mx-auto min-h-[calc(100svh-5rem)] w-full max-w-2xl flex-col items-start justify-center px-5 pb-12",
        className
      )}
      {...props}
    />
  );
}

function DeviceGateVisual({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "aria-hidden" | "children">) {
  return (
    <div
      data-slot="device-gate-visual"
      aria-hidden="true"
      className={cn("relative mb-10 h-36 w-60", className)}
      {...props}
    >
      <span
        data-slot="device-gate-screen"
        className="absolute top-0 left-0 h-28 w-48 overflow-hidden rounded-[1.4rem] border border-[var(--afo-color-border-strong)] bg-card shadow-[var(--afo-shadow-card)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[image:var(--afo-gradient-accent)] before:content-[''] after:absolute after:bottom-[-1rem] after:left-1/2 after:h-5 after:w-16 after:-translate-x-1/2 after:rounded-b-[var(--afo-radius-control)] after:border-x after:border-b after:border-[var(--afo-color-border-strong)] after:content-['']"
      />
      <span
        data-slot="device-gate-tablet"
        className="absolute right-0 bottom-0 h-28 w-[4.75rem] rounded-[1.35rem] border border-[var(--afo-color-border-strong)] bg-[var(--afo-color-background-surface-subtle)] shadow-[var(--afo-shadow-floating)] before:absolute before:top-2 before:left-1/2 before:h-1 before:w-3 before:-translate-x-1/2 before:rounded-[var(--afo-radius-pill)] before:bg-[var(--afo-color-border-strong)] before:content-[''] after:absolute after:inset-x-2 after:top-5 after:bottom-3 after:rounded-[var(--afo-radius-control)] after:bg-[var(--afo-accent-soft)] after:content-['']"
      />
    </div>
  );
}

function DeviceGateEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="device-gate-eyebrow"
      className={cn(
        "m-0 mb-5 inline-flex items-center gap-3 text-xs font-extrabold tracking-[var(--afo-letter-spacing-eyebrow)] text-[var(--afo-color-text-accent)] uppercase after:h-px after:w-10 after:bg-primary after:content-['']",
        className
      )}
      {...props}
    />
  );
}

function DeviceGateTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="device-gate-title"
      className={cn(
        "m-0 max-w-[9ch] text-balance font-display text-[clamp(3.5rem,15vw,5.5rem)] leading-[0.86] font-bold tracking-[-0.04em] uppercase",
        className
      )}
      {...props}
    />
  );
}

function DeviceGateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="device-gate-description"
      className={cn(
        "mt-6 mb-0 max-w-lg text-base leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  DeviceGate,
  DeviceGateContent,
  DeviceGateDescription,
  DeviceGateEyebrow,
  DeviceGateFallback,
  DeviceGateHeader,
  DeviceGateMain,
  DeviceGateTitle,
  DeviceGateVisual,
};
