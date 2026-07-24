"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"
import { SidebarInset, SidebarProvider } from "./sidebar.js"

function WorkspaceShell({
  className,
  ...props
}: React.ComponentProps<typeof SidebarProvider>) {
  return (
    <SidebarProvider
      data-slot="workspace-shell"
      className={cn("min-h-svh bg-background text-foreground", className)}
      {...props}
    />
  )
}

function WorkspaceMain({
  className,
  ...props
}: React.ComponentProps<typeof SidebarInset>) {
  return (
    <SidebarInset
      data-slot="workspace-main"
      className={cn("min-w-0 overflow-x-clip", className)}
      {...props}
    />
  )
}

function WorkspaceHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="workspace-header"
      className={cn(
        "sticky top-0 z-10 flex min-h-16 items-center gap-3 border-b border-[var(--afo-material-glass-border)] bg-[var(--afo-material-glass-fill)] px-4 backdrop-blur-[var(--afo-material-glass-blur)] backdrop-saturate-[var(--afo-material-glass-saturate)] md:px-6",
        className
      )}
      {...props}
    />
  )
}

function WorkspaceHeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="workspace-heading"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  )
}

function WorkspaceEyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="workspace-eyebrow"
      className={cn(
        "m-0 text-[0.6rem] font-extrabold tracking-[0.16em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function WorkspaceTitle({
  as: Component = "h1",
  className,
  ...props
}: React.ComponentProps<"h1"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Component
      data-slot="workspace-title"
      className={cn(
        "m-0 truncate font-display text-2xl font-semibold tracking-[-0.035em] uppercase",
        className
      )}
      {...props}
    />
  )
}

function WorkspaceActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="workspace-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

function WorkspaceContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="workspace-content"
      className={cn("min-w-0 flex-1 p-4 md:p-6", className)}
      {...props}
    />
  )
}

export {
  WorkspaceActions,
  WorkspaceContent,
  WorkspaceEyebrow,
  WorkspaceHeader,
  WorkspaceHeading,
  WorkspaceMain,
  WorkspaceShell,
  WorkspaceTitle,
}
