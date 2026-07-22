"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "../lib/utils.js"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex h-11 w-12 shrink-0 items-center rounded-full outline-none before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-input before:transition-colors data-[size=default]:before:h-5 data-[size=default]:before:w-9 data-[size=sm]:before:h-4 data-[size=sm]:before:w-8 focus-visible:before:outline focus-visible:before:outline-ring aria-invalid:before:outline aria-invalid:before:outline-destructive data-checked:before:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none absolute left-2.5 block rounded-full bg-foreground transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=default]/switch:data-checked:bg-primary-foreground group-data-[size=sm]/switch:data-checked:bg-primary-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
