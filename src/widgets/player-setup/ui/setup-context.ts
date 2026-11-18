import { createContext, use } from 'react'
import type { AccompanimentChoice, PatternFit } from '@/entities/pattern'
import type { FigureChange } from '../model/setup-params'

/**
 * The sheet's lists that open as its pages (the patterns, their Sort and filter, each hand's
 * parts), or one of the music's own pages by its id.
 */
export type SetupPage = 'pattern' | 'patternFilter' | 'rh' | 'lh' | (string & {})

interface SetupContextValue {
  readonly figures: AccompanimentChoice
  /** What the music has for its patterns: From the chart, the patterns it plays. */
  readonly fit: PatternFit
  openPage(page: SetupPage): void
  /** A change made on the first page itself (the inversion). */
  onFigures(change: FigureChange): void
}

export const SetupContext = createContext<SetupContextValue | null>(null)

/** The Setup sheet's figures and pages, for a row or card on its first page. */
export function useSetup(): SetupContextValue {
  const setup = use(SetupContext)
  if (!setup) throw new Error('A Setup row is used inside PlayerSetup')
  return setup
}
