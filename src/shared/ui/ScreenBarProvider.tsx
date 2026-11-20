import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NO_BAR_SIZE, ScreenBarContext, SCREEN_BAR_VAR, type ScreenBar } from './screen-bar'

/**
 * A screen's bar: it stays on the screen while the page scrolls under it (craft-details, Bars stay,
 * quietly; the canvas no longer hides it). What stays at the top sits under it through
 * `--screen-bar` (the `top-screen-bar` utility): the bar's whole height, the notch's room with it.
 */
export function ScreenBarProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState(NO_BAR_SIZE)
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    root.current?.style.setProperty(SCREEN_BAR_VAR, `${size.box}px`)
  }, [size.box])
  const bar = useMemo<ScreenBar>(() => ({ report: setSize }), [])
  return (
    <ScreenBarContext value={bar}>
      <div ref={root} data-slot="screen-bar-root" className="contents">
        {children}
      </div>
    </ScreenBarContext>
  )
}
