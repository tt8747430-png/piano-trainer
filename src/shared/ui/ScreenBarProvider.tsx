import { useMemo, useState, type ReactNode } from 'react'
import { useShownOnScrollUp } from '@/shared/lib'
import { ScreenBarContext, type ScreenBar } from './screen-bar'

/** A screen's bar: shown at the top and on the way back up, hidden while the page is read downwards. */
export function ScreenBarProvider({ children }: { children: ReactNode }) {
  const scrolledUp = useShownOnScrollUp()
  const [height, setHeight] = useState(0)
  const [held, setHeld] = useState(false)
  const shown = scrolledUp || held
  const bar = useMemo<ScreenBar>(
    () => ({ offset: shown ? height : 0, shown, report: setHeight, hold: setHeld }),
    [shown, height],
  )
  return <ScreenBarContext value={bar}>{children}</ScreenBarContext>
}
