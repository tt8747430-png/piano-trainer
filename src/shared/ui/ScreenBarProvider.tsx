import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useShownOnScrollUp } from '@/shared/lib'
import {
  NO_BAR_SIZE,
  PINNED_VAR,
  ScreenBarContext,
  SCREEN_BAR_VAR,
  type ScreenBar,
} from './screen-bar'

/**
 * A screen's bar: shown until the page has scrolled past it and on the way back up, hidden while the
 * page is read downwards. What stays at the top sits under it through `--screen-bar` (the
 * `top-screen-bar` utility): the height of the bar's rows while it shows, else 0. What is pinned
 * under it stands `--pinned` tall, so a jump to a heading lands clear of both (`scroll-mt-pinned`).
 */
export function ScreenBarProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState(NO_BAR_SIZE)
  const scrolledUp = useShownOnScrollUp(size.box)
  const [held, setHeld] = useState(false)
  const [pinned, setPinned] = useState(0)
  const shown = scrolledUp || held
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    root.current?.style.setProperty(SCREEN_BAR_VAR, `${shown ? size.rows : 0}px`)
  }, [shown, size.rows])
  useLayoutEffect(() => {
    root.current?.style.setProperty(PINNED_VAR, `${pinned}px`)
  }, [pinned])
  const bar = useMemo<ScreenBar>(
    () => ({ shown, report: setSize, hold: setHeld, pin: setPinned }),
    [shown],
  )
  return (
    <ScreenBarContext value={bar}>
      <div ref={root} data-slot="screen-bar-root" className="contents">
        {children}
      </div>
    </ScreenBarContext>
  )
}
