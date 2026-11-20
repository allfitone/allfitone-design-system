/**
 * Typographic component for web surfaces, the counterpart of the React Native
 * `Text`.
 *
 * A role plus a size is the whole API. Products do not compose a role out of
 * primitives, because that is how two screens end up with the same intent
 * rendered at different line heights.
 *
 * Three things differ from React Native, and only because the platform does:
 *
 * - `as` picks the element. A role says how text looks; the document decides
 *   whether it is a paragraph or a second-level heading.
 * - `role` is the typographic role, so the ARIA attribute of the same name is
 *   not reachable here. A live region or a landmark belongs to the element
 *   around the text, or to `Alert`.
 * - The margin is cleared here. The stylesheet ships without a browser reset,
 *   and a paragraph that brings its own margin adds to every `gap` around it.
 */

import * as React from "react"

import { cn } from "../lib/utils.js"
import type { typography, typographyRole } from "../tokens.js"

type TextRole = keyof typeof typographyRole
type TextSize = keyof typeof typography.size

/**
 * Colour roles a product may ask for by name. Deliberately a subset of the
 * palette: `background` and `action` are not text colours, and offering them
 * here would invite a contrast failure.
 */
type TextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "disabled"
  | "inverse"
  | "accent"
  | "danger"
  | "success"

type TextAlign = "start" | "center" | "end"

/** Elements that carry text and take no attributes of their own. */
type TextElement =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "strong"
  | "em"
  | "small"
  | "dt"
  | "dd"
  | "li"
  | "figcaption"
  | "legend"

// Written out one by one: the stylesheet is built from the literals in this file.
const roleClasses: Record<TextRole, string> = {
  display:
    "font-(family-name:--afo-typography-display-font-family) font-(--afo-typography-display-font-weight) leading-(--afo-typography-display-line-height) tracking-(--afo-typography-display-letter-spacing) text-balance",
  heading:
    "font-(family-name:--afo-typography-heading-font-family) font-(--afo-typography-heading-font-weight) leading-(--afo-typography-heading-line-height) tracking-(--afo-typography-heading-letter-spacing) text-balance",
  body: "font-(family-name:--afo-typography-body-font-family) font-(--afo-typography-body-font-weight) leading-(--afo-typography-body-line-height) tracking-(--afo-typography-body-letter-spacing) text-pretty",
  label:
    "font-(family-name:--afo-typography-label-font-family) font-(--afo-typography-label-font-weight) leading-(--afo-typography-label-line-height) tracking-(--afo-typography-label-letter-spacing)",
  eyebrow:
    "font-(family-name:--afo-typography-eyebrow-font-family) font-(--afo-typography-eyebrow-font-weight) leading-(--afo-typography-eyebrow-line-height) tracking-(--afo-typography-eyebrow-letter-spacing)",
  control:
    "font-(family-name:--afo-typography-control-font-family) font-(--afo-typography-control-font-weight) leading-(--afo-typography-control-line-height) tracking-(--afo-typography-control-letter-spacing)",
  // The role promises tabular figures: a running clock must not reflow per tick.
  data: "font-(family-name:--afo-typography-data-font-family) font-(--afo-typography-data-font-weight) leading-(--afo-typography-data-line-height) tracking-(--afo-typography-data-letter-spacing) tabular-nums",
  poster:
    "font-(family-name:--afo-typography-poster-font-family) font-(--afo-typography-poster-font-weight) leading-(--afo-typography-poster-line-height) tracking-(--afo-typography-poster-letter-spacing) italic",
}

const sizeClasses: Record<TextSize, string> = {
  "2xs": "text-[length:var(--afo-font-size-2xs)]",
  xs: "text-[length:var(--afo-font-size-xs)]",
  sm: "text-[length:var(--afo-font-size-sm)]",
  md: "text-[length:var(--afo-font-size-md)]",
  lg: "text-[length:var(--afo-font-size-lg)]",
  xl: "text-[length:var(--afo-font-size-xl)]",
  "2xl": "text-[length:var(--afo-font-size-2xl)]",
  "3xl": "text-[length:var(--afo-font-size-3xl)]",
  "4xl": "text-[length:var(--afo-font-size-4xl)]",
  "5xl": "text-[length:var(--afo-font-size-5xl)]",
  "6xl": "text-[length:var(--afo-font-size-6xl)]",
  "7xl": "text-[length:var(--afo-font-size-7xl)]",
  "8xl": "text-[length:var(--afo-font-size-8xl)]",
  "9xl": "text-[length:var(--afo-font-size-9xl)]",
}

const colorClasses: Record<TextColor, string> = {
  primary: "text-[color:var(--afo-color-text-primary)]",
  secondary: "text-[color:var(--afo-color-text-secondary)]",
  muted: "text-[color:var(--afo-color-text-muted)]",
  disabled: "text-[color:var(--afo-color-text-disabled)]",
  inverse: "text-[color:var(--afo-color-text-inverse)]",
  accent: "text-[color:var(--afo-color-text-accent)]",
  danger: "text-[color:var(--afo-color-text-danger)]",
  success: "text-[color:var(--afo-color-text-success)]",
}

const alignClasses: Record<TextAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
}

type TextProps = Omit<React.HTMLAttributes<HTMLElement>, "role" | "color"> & {
  ref?: React.Ref<HTMLElement>
  as?: TextElement
  role?: TextRole
  size?: TextSize
  color?: TextColor
  align?: TextAlign
  uppercase?: boolean
  /**
   * Replaces the role's letter spacing, as an `em` ratio, for this text only.
   * Big display numerals touch at the role's tight tracking; `0.01` opens them.
   */
  tracking?: number
}

function Text({
  as = "p",
  role = "body",
  size = "md",
  color = "primary",
  align,
  uppercase = false,
  tracking,
  className,
  style,
  ...props
}: TextProps) {
  // Not JSX: a tag held in a variable is checked against one element's ref
  // type, and `createElement` takes the shared `HTMLElement` instead.
  return React.createElement(as, {
    "data-slot": "text",
    "data-role": role,
    "data-size": size,
    className: cn(
      "m-0",
      // The size goes first: merged after the role it would drop the role's line height.
      sizeClasses[size],
      roleClasses[role],
      colorClasses[color],
      align && alignClasses[align],
      uppercase && "uppercase",
      className
    ),
    style: tracking === undefined ? style : { ...style, letterSpacing: `${tracking}em` },
    ...props,
  })
}

export { Text }
export type { TextAlign, TextColor, TextElement, TextProps, TextRole, TextSize }
