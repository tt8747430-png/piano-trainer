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

/** A screen's bar, as its header reports it. It never leaves the screen (craft-details, Bars stay, quietly). */
export interface ScreenBar {
  /** The header measured: `NO_BAR_SIZE` once it is gone. */
  report(size: ScreenBarSize): void
}

/** Outside a `ScreenBarProvider`: nothing offset. */
const NO_BAR: ScreenBar = { report: () => {} }
export const ScreenBarContext = createContext<ScreenBar>(NO_BAR)

/** The screen's bar, for its header. */
export const useScreenBar = (): ScreenBar => use(ScreenBarContext)
