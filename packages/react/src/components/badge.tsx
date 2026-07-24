import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

const badgeVariants = cva(
  // Reference .badge: 9.5px / 800 / uppercase / .08em / 3.5px 9px / pill.
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-[9px] py-[3.5px] text-[0.59375rem] leading-[1.5] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap transition-colors [a]:min-h-11 [a]:px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[var(--afo-color-accent-tonal)] text-[var(--afo-color-text-accent)] [a]:hover:bg-primary/20",
        secondary:
          "bg-muted text-muted-foreground [a]:hover:bg-accent [a]:hover:text-foreground",
        destructive:
          "bg-destructive/12 text-danger-text [a]:hover:bg-destructive/20",
        outline:
          "bg-transparent text-muted-foreground [a]:hover:bg-muted",
        ghost:
          "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success/12 text-success [a]:hover:bg-success/20",
        warning: "bg-warning/12 text-warning [a]:hover:bg-warning/20",
        info: "bg-info/12 text-info [a]:hover:bg-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
