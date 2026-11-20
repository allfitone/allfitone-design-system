import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

const buttonVariants = cva(
  // no-underline: the published stylesheet carries no preflight, so an anchor
  // rendered with these classes would keep the user agent's link underline.
  // The label is the `control` role, as on React Native. Its line height sits in
  // each size, after the font size: merged before it, the size would drop it.
  "group/button inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--afo-radius-action)] border border-transparent bg-clip-padding font-(--afo-typography-control-font-weight) tracking-(--afo-typography-control-letter-spacing) whitespace-nowrap no-underline shadow-[var(--afo-control-shadow)] outline-none select-none transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--afo-motion-feedback-duration)] ease-[var(--afo-motion-feedback-easing)] hover:-translate-y-px hover:shadow-[var(--afo-control-shadow-hover)] active:translate-y-px active:shadow-[var(--afo-control-shadow)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--afo-color-action-primary-hover)]",
        // Both rest on the control border: the subtle one vanished on the dark surface.
        outline:
          "border-input bg-transparent text-[var(--afo-color-text-secondary)] hover:border-primary hover:bg-muted hover:text-foreground aria-expanded:border-primary aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "border-input bg-secondary text-secondary-foreground hover:border-primary hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        // Ghost and link clear the user agent's button face themselves: no Preflight does it.
        ghost:
          "bg-transparent text-foreground shadow-none hover:bg-muted hover:shadow-none aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-[color-mix(in_oklch,var(--destructive),var(--foreground)_8%)]",
        link: "bg-transparent text-[var(--afo-color-text-accent)] shadow-none hover:translate-y-0 hover:shadow-none active:translate-y-0 underline-offset-4 hover:underline",
      },
      size: {
        // The React Native button's sizes: the body size, and one step down when small.
        default:
          "gap-2 px-5 py-[9px] text-base leading-(--afo-typography-control-line-height) has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "gap-1.5 px-3 py-1 text-xs leading-(--afo-typography-control-line-height) [&_svg:not([class*='size-'])]:size-3",
        sm: "gap-1.5 px-3.5 py-1.5 text-sm leading-(--afo-typography-control-line-height) [&_svg:not([class*='size-'])]:size-3.5",
        // The one primary action of a screen: the same label on a 48 px target.
        lg: "min-h-12 gap-2 px-6 py-3 text-base leading-(--afo-typography-control-line-height)",
        icon: "size-11",
        "icon-xs":
          "size-11 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-11 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
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
