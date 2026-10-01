import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useShownOnScrollUp } from '@/shared/lib'
import { ScreenBarContext, SCREEN_BAR_VAR, type ScreenBar } from './screen-bar'

/**
 * A screen's bar: shown at the top and on the way back up, hidden while the page is read downwards.
 * What stays at the top sits under it through `--screen-bar` (the `top-screen-bar` utilities): the
 * bar's row height while it shows, else 0.
 */
export function ScreenBarProvider({ children }: { children: ReactNode }) {
  const scrolledUp = useShownOnScrollUp()
  const [height, setHeight] = useState(0)
  const [held, setHeld] = useState(false)
  const shown = scrolledUp || held
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    root.current?.style.setProperty(SCREEN_BAR_VAR, `${shown ? height : 0}px`)
  }, [shown, height])
  const bar = useMemo<ScreenBar>(() => ({ shown, report: setHeight, hold: setHeld }), [shown])
  return (
    <ScreenBarContext value={bar}>
      <div ref={root} data-slot="screen-bar-root" className="contents">
        {children}
      </div>
    </ScreenBarContext>
  )
}
