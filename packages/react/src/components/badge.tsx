import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-[0.7rem] font-bold tracking-[-0.01em] whitespace-nowrap transition-colors [a]:min-h-11 [a]:px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-primary/45 bg-primary/15 text-foreground [a]:hover:bg-primary/22",
        secondary:
          "border-border bg-muted text-foreground [a]:hover:border-input [a]:hover:bg-accent",
        destructive:
          "border-destructive/45 bg-destructive/15 text-foreground [a]:hover:bg-destructive/22",
        outline:
          "border-input bg-transparent text-foreground [a]:hover:bg-muted",
        ghost:
          "border-transparent hover:bg-muted hover:text-foreground",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
        success: "border-success/45 bg-success/15 text-foreground [a]:hover:bg-success/22",
        warning: "border-warning/45 bg-warning/15 text-foreground [a]:hover:bg-warning/22",
        info: "border-info/45 bg-info/15 text-foreground [a]:hover:bg-info/22",
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
