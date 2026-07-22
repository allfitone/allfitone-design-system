import type { ComponentProps } from "react"

import { Button } from "./button.js"

type IconButtonProps = Omit<ComponentProps<typeof Button>, "aria-label"> & {
  "aria-label": string
}

function IconButton({ size = "icon", ...props }: IconButtonProps) {
  return <Button data-slot="icon-button" size={size} {...props} />
}

export { IconButton }
export type { IconButtonProps }
