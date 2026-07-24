import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--afo-radius-action)] border border-transparent bg-clip-padding text-[0.78125rem] font-extrabold pointer-coarse:min-h-11 pointer-coarse:min-w-11 whitespace-nowrap shadow-[var(--afo-control-shadow)] outline-none select-none transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] hover:-translate-y-px hover:shadow-[var(--afo-control-shadow-hover)] active:translate-y-px active:shadow-[var(--afo-control-shadow)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--afo-color-action-primary-hover)]",
        outline:
          "border-border bg-transparent text-[var(--afo-color-text-secondary)] hover:border-primary hover:bg-muted hover:text-foreground aria-expanded:border-primary aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:border-input hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "text-foreground shadow-none hover:bg-muted hover:shadow-none aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-[color-mix(in_oklch,var(--destructive),var(--foreground)_8%)]",
        link: "text-primary shadow-none hover:translate-y-0 hover:shadow-none active:translate-y-0 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "gap-2 px-[18px] py-[9px] has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "gap-1.5 px-3 py-1 text-[0.6875rem] [&_svg:not([class*='size-'])]:size-3",
        sm: "gap-1.5 px-3.5 py-1.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "gap-2 px-6 py-3 text-sm",
        icon: "size-9",
        "icon-xs":
          "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
