"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { FoundationIcon } from "../icons.js"
import { cn } from "../lib/utils.js"

type AvatarSize = "sm" | "default" | "lg"
type AvatarPresenceStatus = "online" | "away" | "busy" | "offline"

type AvatarBaseProps = Omit<
  AvatarPrimitive.Root.Props,
  "aria-label" | "aria-labelledby" | "aria-hidden" | "role"
> & {
  size?: AvatarSize
}

type AvatarProps = AvatarBaseProps &
  (
    | {
        decorative: true
        "aria-label"?: never
        "aria-labelledby"?: never
      }
    | ({
        decorative?: false
      } & (
        | {
            "aria-label": string
            "aria-labelledby"?: never
          }
        | {
            "aria-label"?: never
            "aria-labelledby": string
          }
      ))
  )

function Avatar({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  decorative = false,
  size = "default",
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      role={decorative ? undefined : "group"}
      aria-label={decorative ? undefined : ariaLabel}
      aria-labelledby={decorative ? undefined : ariaLabelledBy}
      aria-hidden={decorative || undefined}
      className={cn(
        "group/avatar relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl rounded-tr-sm border border-border bg-muted text-foreground shadow-[var(--afo-control-shadow)] select-none data-[size=lg]:size-14 data-[size=sm]:size-8",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  alt = "",
  className,
  ...props
}: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      alt={alt}
      className={cn(
        "aspect-square size-full rounded-[inherit] object-cover transition-opacity duration-[var(--afo-motion-feedback-duration)] data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

type AvatarFallbackProps = Omit<
  AvatarPrimitive.Fallback.Props,
  "children"
> & {
  children: React.ReactNode
}

function AvatarFallback({
  children,
  className,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      aria-hidden="true"
      className={cn(
        "flex size-full items-center justify-center rounded-[inherit] bg-muted font-display text-base leading-none font-bold tracking-[0.04em] text-muted-foreground group-data-[size=lg]/avatar:text-xl group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}

const avatarPresenceIcon = {
  online: "check",
  away: "time",
  busy: "indeterminate",
  offline: "close",
} as const

type AvatarPresenceProps = Omit<
  React.ComponentProps<"span">,
  "aria-label" | "children"
> & {
  label: string
  status: AvatarPresenceStatus
}

function AvatarPresence({
  className,
  label,
  status,
  ...props
}: AvatarPresenceProps) {
  return (
    <span
      data-slot="avatar-presence"
      data-status={status}
      role="img"
      aria-label={label}
      className={cn(
        "absolute -end-1 -bottom-1 z-10 inline-flex size-5 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground shadow-[var(--afo-control-shadow)] group-data-[size=lg]/avatar:size-6 group-data-[size=sm]/avatar:size-4 group-data-[size=sm]/avatar:[&>svg]:size-2.5 data-[status=away]:bg-warning data-[status=away]:text-warning-foreground data-[status=busy]:bg-destructive data-[status=busy]:text-destructive-foreground data-[status=offline]:border-border data-[status=online]:bg-success data-[status=online]:text-success-foreground [&>svg]:size-3",
        className
      )}
      {...props}
    >
      <FoundationIcon
        name={avatarPresenceIcon[status]}
        size="xs"
        strokeScale="compact"
        decorative
      />
    </span>
  )
}

type AvatarGroupProps = Omit<React.ComponentProps<"div">, "role"> & {
  "aria-label": string
}

function AvatarGroup({
  "aria-label": ariaLabel,
  className,
  ...props
}: AvatarGroupProps) {
  return (
    <div
      data-slot="avatar-group"
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center [&>[data-slot=avatar]+[data-slot=avatar]]:-ms-2.5 [&>[data-slot=avatar-group-count]]:-ms-2.5 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background",
        className
      )}
      {...props}
    />
  )
}

type AvatarGroupCountProps = Omit<
  React.ComponentProps<"span">,
  "aria-label" | "children"
> & {
  count: number
  label: string
  size?: AvatarSize
}

function AvatarGroupCount({
  className,
  count,
  label,
  size = "default",
  ...props
}: AvatarGroupCountProps) {
  return (
    <span
      data-slot="avatar-group-count"
      data-size={size}
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl rounded-tr-sm border border-border bg-card font-display text-sm leading-none font-bold tracking-[0.03em] text-muted-foreground ring-2 ring-background data-[size=lg]:size-14 data-[size=lg]:text-lg data-[size=sm]:size-8 data-[size=sm]:text-xs",
        className
      )}
      {...props}
    >
      <span aria-hidden="true">+{count}</span>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarPresence,
}
export type {
  AvatarFallbackProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
  AvatarPresenceProps,
  AvatarPresenceStatus,
  AvatarProps,
  AvatarSize,
}
