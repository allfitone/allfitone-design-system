import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Second breakpoint, above the mobile one: the viewport still has room for a
// two-pane layout but not for an expanded sidebar. Products opt in per surface,
// so nothing changes for consumers that do not pass a width.
export function useIsNarrowerThan(width?: number): boolean {
  const [isNarrower, setIsNarrower] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (width === undefined) {
      setIsNarrower(false)
      return
    }

    const mql = window.matchMedia(`(max-width: ${width - 1}px)`)
    const onChange = () => {
      setIsNarrower(window.innerWidth < width)
    }
    mql.addEventListener("change", onChange)
    setIsNarrower(window.innerWidth < width)
    return () => mql.removeEventListener("change", onChange)
  }, [width])

  return !!isNarrower
}
