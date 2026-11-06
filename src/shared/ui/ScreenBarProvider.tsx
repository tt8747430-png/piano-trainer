import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useShownOnScrollUp } from '@/shared/lib'
import { NO_BAR_SIZE, ScreenBarContext, SCREEN_BAR_VAR, type ScreenBar } from './screen-bar'

/**
 * A screen's bar: shown until the page has scrolled past it and on the way back up, hidden while the
 * page is read downwards. What stays at the top sits under it through `--screen-bar` (the
 * `top-screen-bar` utility): the bar's whole height (the notch's room with it) while it shows, else 0.
 */
export function ScreenBarProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState(NO_BAR_SIZE)
  // A page under two screens tall keeps its bar: hiding it would only take the controls along (A31).
  const scrolledUp = useShownOnScrollUp(size.box, { tall: 2 })
  const [held, setHeld] = useState(false)
  const shown = scrolledUp || held
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    root.current?.style.setProperty(SCREEN_BAR_VAR, `${shown ? size.box : 0}px`)
    // Whether the bar is away: what is pinned under it then keeps the notch's room itself (R31-S).
    root.current?.style.setProperty('--screen-bar-away', shown ? '0' : '1')
  }, [shown, size.box])
  const bar = useMemo<ScreenBar>(() => ({ shown, report: setSize, hold: setHeld }), [shown])
  return (
    <ScreenBarContext value={bar}>
      <div ref={root} data-slot="screen-bar-root" className="contents">
        {children}
      </div>
    </ScreenBarContext>
  )
}
