"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { ForwardIcon } from "../icons.js";
import { cn } from "../lib/utils.js";

const choiceCardVariants = cva(
  "group/choice relative flex min-h-44 w-full appearance-none flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 text-left text-card-foreground no-underline shadow-[var(--afo-shadow-card)] outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] hover:-translate-y-px hover:border-primary hover:shadow-[var(--afo-control-shadow-hover)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-card",
        muted: "bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ChoiceCardProps = useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> &
  VariantProps<typeof choiceCardVariants>;

function ChoiceCard({
  className,
  variant = "default",
  render,
  type = "button",
  ...props
}: ChoiceCardProps) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type,
        className: cn(choiceCardVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "choice-card",
      variant,
    },
  });
}

function ChoiceCardEyebrow({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choice-card-eyebrow"
      className={cn(
        "text-xs font-extrabold tracking-[var(--afo-letter-spacing-eyebrow)] text-[var(--afo-color-text-accent)] uppercase",
        className
      )}
      {...props}
    />
  );
}

function ChoiceCardTitle({
  className,
  ...props
}: React.ComponentProps<"strong">) {
  return (
    <strong
      data-slot="choice-card-title"
      className={cn("text-xl leading-tight font-bold", className)}
      {...props}
    />
  );
}

function ChoiceCardDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choice-card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function ChoiceCardAction({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choice-card-action"
      className={cn(
        "mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[var(--afo-color-text-accent)]",
        className
      )}
      {...props}
    >
      {children}
      <ForwardIcon decorative />
    </span>
  );
}

export {
  ChoiceCard,
  ChoiceCardAction,
  ChoiceCardDescription,
  ChoiceCardEyebrow,
  ChoiceCardTitle,
  choiceCardVariants,
};
export type { ChoiceCardProps };
