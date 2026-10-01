import { createContext, use } from 'react'

/** The CSS variable what stays at the top reads: how far below the bar it sits. */
export const SCREEN_BAR_VAR = '--screen-bar'

/** A screen's bar, as its header reports it. */
export interface ScreenBar {
  readonly shown: boolean
  /** The header's row measured: 0 once it is gone. */
  report(height: number): void
  /** Focus is inside the bar: it stays. */
  hold(held: boolean): void
}

/** Outside a `ScreenBarProvider`: a bar that always shows, nothing offset. */
const NO_BAR: ScreenBar = { shown: true, report: () => {}, hold: () => {} }
export const ScreenBarContext = createContext<ScreenBar>(NO_BAR)

/** The screen's bar, for its header. */
export const useScreenBar = (): ScreenBar => use(ScreenBarContext)
