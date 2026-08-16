import * as React from "react";

import { CheckIcon } from "../icons.js";
import { cn } from "../lib/utils.js";

function SetupShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="setup-shell"
      className={cn(
        "relative isolate min-h-svh overflow-hidden bg-background text-foreground",
        "before:absolute before:inset-0 before:-z-20 before:bg-[radial-gradient(circle_at_88%_10%,var(--afo-accent-soft),transparent_34%),linear-gradient(145deg,var(--background)_0%,var(--afo-color-background-canvas)_100%)] before:content-['']",
        className
      )}
      {...props}
    />
  );
}

function SetupHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="setup-header"
      className={cn(
        "relative z-10 mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10",
        className
      )}
      {...props}
    />
  );
}

type SetupMainProps =
  | ({ as?: "main" } & React.ComponentProps<"main">)
  | ({ as: "div" } & React.ComponentProps<"div">);

const setupMainClassName =
  "relative z-0 mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pb-10 sm:px-8 lg:px-10 lg:pb-16";

function SetupMain(props: SetupMainProps) {
  if (props.as === "div") {
    const { as: _as, className, ...divProps } = props;

    return (
      <div
        data-slot="setup-main"
        className={cn(setupMainClassName, className)}
        {...divProps}
      />
    );
  }

  const { as: _as, className, ...mainProps } = props;

  return (
    <main
      data-slot="setup-main"
      className={cn(setupMainClassName, className)}
      {...mainProps}
    />
  );
}

function SetupStage({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="setup-stage"
      className={cn("min-w-0", className)}
      {...props}
    />
  );
}

function SetupProgress({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="setup-progress"
      className={cn(
        "m-0 flex list-none items-center gap-2 border-y border-border p-0 py-3 sm:gap-4",
        className
      )}
      {...props}
    />
  );
}

type SetupProgressStepProps = Omit<React.ComponentProps<"li">, "children"> & {
  status: "complete" | "current" | "pending";
  index: number;
  label: React.ReactNode;
};

function SetupProgressStep({
  className,
  status,
  index,
  label,
  ...props
}: SetupProgressStepProps) {
  const indexLabel = String(index).padStart(2, "0");

  return (
    <li
      data-slot="setup-progress-step"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "group flex min-w-0 flex-1 items-center gap-2 text-muted-foreground after:ml-auto after:hidden after:h-px after:min-w-4 after:flex-1 after:bg-border after:content-[''] last:after:hidden sm:after:block",
        "data-[status=current]:text-foreground data-[status=complete]:text-foreground",
        className
      )}
      {...props}
    >
      <span
        data-slot="setup-progress-index"
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border border-border font-display text-xs font-bold tabular-nums",
          "group-data-[status=current]:border-primary group-data-[status=current]:bg-primary group-data-[status=current]:text-primary-foreground"
        )}
      >
        {status === "complete" ? <CheckIcon decorative /> : indexLabel}
      </span>
      <span className="truncate text-xs font-extrabold tracking-[var(--afo-letter-spacing-utility)] uppercase">
        {label}
      </span>
    </li>
  );
}

function SetupPanel({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      data-slot="setup-panel"
      className={cn(
        "grid min-w-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[var(--afo-shadow-workspace)] lg:grid-cols-[minmax(18rem,0.88fr)_minmax(0,1.12fr)]",
        className
      )}
      {...props}
    />
  );
}

function SetupPanelIntro({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="setup-panel-intro"
      className={cn(
        "relative flex min-w-0 flex-col justify-center overflow-hidden bg-[var(--afo-color-ink-panel)] p-7 text-[var(--afo-color-neutral-white)] sm:p-10",
        className
      )}
      {...props}
    />
  );
}

function SetupPanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="setup-panel-content"
      className={cn("min-w-0 p-6 sm:p-10", className)}
      {...props}
    />
  );
}

function SetupPanelActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="setup-panel-actions"
      className={cn(
        "mt-6 flex flex-wrap items-center gap-3 [&_[data-slot=button]]:max-sm:w-full",
        className
      )}
      {...props}
    />
  );
}

function SetupPanelEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="setup-panel-eyebrow"
      className={cn(
        "m-0 text-xs font-extrabold tracking-[var(--afo-letter-spacing-eyebrow)] text-[var(--afo-color-brand-primary)] uppercase",
        className
      )}
      {...props}
    />
  );
}

type SetupPanelTitleProps = Omit<React.ComponentProps<"h1">, "as"> & {
  as?: "h1" | "h2" | "h3";
};

function SetupPanelTitle({
  as: Component = "h1",
  className,
  ...props
}: SetupPanelTitleProps) {
  return (
    <Component
      data-slot="setup-panel-title"
      className={cn(
        "mt-4 mb-0 max-w-[13ch] text-balance font-display text-5xl leading-[0.9] font-bold tracking-[-0.03em] uppercase sm:text-6xl",
        className
      )}
      {...props}
    />
  );
}

function SetupPanelDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="setup-panel-description"
      className={cn(
        "mt-5 mb-0 max-w-lg text-sm leading-relaxed text-[var(--afo-color-neutral-steel)] sm:text-base",
        className
      )}
      {...props}
    />
  );
}

function SetupPanelNote({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="setup-panel-note"
      className={cn(
        "mt-8 flex items-start gap-3 border-t border-[color-mix(in_srgb,var(--afo-color-neutral-white)_14%,transparent)] pt-5 text-sm leading-relaxed text-[var(--afo-color-neutral-steel)] [&_svg]:mt-0.5 [&_svg]:shrink-0 [&_svg]:text-[var(--afo-color-brand-primary)]",
        className
      )}
      {...props}
    />
  );
}

export {
  SetupHeader,
  SetupMain,
  SetupPanel,
  SetupPanelActions,
  SetupPanelContent,
  SetupPanelDescription,
  SetupPanelEyebrow,
  SetupPanelIntro,
  SetupPanelNote,
  SetupPanelTitle,
  SetupProgress,
  SetupProgressStep,
  SetupShell,
  SetupStage,
};
export type { SetupMainProps, SetupPanelTitleProps, SetupProgressStepProps };
