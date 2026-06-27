import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * React hook that reports whether the viewport is below the mobile breakpoint
 * ({@link MOBILE_BREAKPOINT}px).
 *
 * Subscribes to a media query and updates on resize. Returns `false` during the
 * initial (pre-measurement) render to keep server/client output consistent.
 *
 * @returns `true` when the viewport width is considered mobile.
 */
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
