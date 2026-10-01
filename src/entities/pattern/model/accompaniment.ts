import type { ArrangeOptions } from '@/shared/lib/arrangement'
import type { Inversion } from '@/shared/lib/music'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import { PATTERNS } from '../content/patterns'
import type { LeftFigureId, PatternId, RightFigureId } from './types'

/**
 * How the hands accompany: a pattern, a figure of its own for either hand over it, and the inversion
 * the right hand's chord keeps (`null`: each chord voice-led from the last).
 */
export interface Accompaniment {
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  readonly inversion: Inversion | null
}

/** A pattern as the Player's Setup chooses it: one for every chord, or From the chart (the chart's own methods). */
export type PatternChoice = PatternId | 'chart'

/** An accompaniment as the Player's Setup chooses it: its pattern may be From the chart. */
export interface AccompanimentChoice extends Omit<Accompaniment, 'pattern'> {
  readonly pattern: PatternChoice
}

/** An accompaniment as `arrange` takes it: the pattern, each hand's own figure laid over it. */
export const accompanimentOptions = ({
  pattern,
  rh,
  lh,
  inversion,
}: Accompaniment): Pick<ArrangeOptions, 'pattern' | 'rh' | 'lh' | 'inversion'> => ({
  pattern: PATTERNS[pattern].pattern,
  ...(rh ? { rh: RIGHT_FIGURES[rh].figure } : {}),
  ...(lh ? { lh: LEFT_FIGURES[lh].figure } : {}),
  ...(inversion === null ? {} : { inversion }),
})
