import { createContext, use } from 'react'

/** A screen's bar, as its header reports it and what stays at the top under it reads it. */
export interface ScreenBar {
  /** How far what stays at the top sits below the bar: its row's height while it shows, else 0. */
  readonly offset: number
  readonly shown: boolean
  /** The header's row measured: 0 once it is gone. */
  report(height: number): void
  /** Focus is inside the bar: it stays. */
  hold(held: boolean): void
}

/** Outside a `ScreenBarProvider`: no bar, nothing offset. */
const NO_BAR: ScreenBar = { offset: 0, shown: true, report: () => {}, hold: () => {} }
export const ScreenBarContext = createContext<ScreenBar>(NO_BAR)

/** The screen's bar, for its header and for what stays at the top under it. */
export const useScreenBar = (): ScreenBar => use(ScreenBarContext)
