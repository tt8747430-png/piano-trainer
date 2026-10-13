import { createContext, use } from 'react'

/** The CSS variable what stays at the top reads: how far below the bar it sits. */
export const SCREEN_BAR_VAR = '--screen-bar'

/** The bar measured: its rows, which pinned content sits under, and its whole box, clear of the notch. */
export interface ScreenBarSize {
  readonly rows: number
  readonly box: number
}

/** No bar on the screen. */
export const NO_BAR_SIZE: ScreenBarSize = { rows: 0, box: 0 }

/** A screen's bar, as its header reports it. */
export interface ScreenBar {
  readonly shown: boolean
  /** The header measured: `NO_BAR_SIZE` once it is gone. */
  report(size: ScreenBarSize): void
  /** Focus is inside the bar: it stays. */
  hold(held: boolean): void
}

/** Outside a `ScreenBarProvider`: a bar that always shows, nothing offset. */
const NO_BAR: ScreenBar = { shown: true, report: () => {}, hold: () => {} }
export const ScreenBarContext = createContext<ScreenBar>(NO_BAR)

/** The screen's bar, for its header. */
export const useScreenBar = (): ScreenBar => use(ScreenBarContext)
