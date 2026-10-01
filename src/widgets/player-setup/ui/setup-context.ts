import { createContext, use } from 'react'
import type { AccompanimentChoice } from '@/entities/pattern'
import type { FigureChange } from '../model/setup-params'

/** The sheet's lists that open as its pages. */
export type SetupPage = 'pattern' | 'rh' | 'lh'

interface SetupContextValue {
  readonly figures: AccompanimentChoice
  openPage(page: SetupPage): void
  /** A change made on the first page itself (the inversion). */
  onFigures(change: FigureChange): void
}

export const SetupContext = createContext<SetupContextValue | null>(null)

/** The Setup sheet's figures and pages, for a row on its first page. */
export function useSetup(): SetupContextValue {
  const setup = use(SetupContext)
  if (!setup) throw new Error('A Setup row is used inside PlayerSetup')
  return setup
}
