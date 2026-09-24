"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-3.5 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

// A horizontal strip wraps onto a second row rather than scrolling. Scrolling
// puts a tab out of sight, and a tab out of sight is a section the person never
// learns exists. `w-fit` resolves to the space available once wrapping is
// allowed, so a strip that already fits is laid out exactly as before.
const tabsListVariants = cva(
  "group/tabs-list inline-flex min-h-11 w-fit max-w-full items-center justify-center bg-transparent p-0 text-muted-foreground group-data-horizontal/tabs:flex-wrap group-data-horizontal/tabs:justify-start group-data-horizontal/tabs:border-b group-data-horizontal/tabs:border-border group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:border-r group-data-vertical/tabs:border-border",
  {
    variants: {
      variant: {
        // Reference .tabs: gap 18px between triggers.
        default: "gap-[1.125rem]",
        line: "gap-[1.125rem]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // Reference .tabs span: 12px / 700 / padding 8px 1px / tx3.
        // Horizontal tabs keep the width of their label: stretched to fill a
        // wrapped row, a lone tab on the second row reads as centered rather
        // than as the strip continuing.
        "relative inline-flex min-h-11 flex-1 group-data-horizontal/tabs:flex-none items-center justify-center gap-1.5 border-0 bg-transparent px-px py-2 text-xs font-bold whitespace-nowrap text-muted-foreground transition-[color] group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:text-foreground",
        "after:absolute after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-2 group-data-vertical/tabs:after:-right-px group-data-vertical/tabs:after:w-0.5 data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
