import type { ArrangeOptions } from '@/shared/lib/arrangement'
import type { Inversion } from '@/shared/lib/music'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import type { PatternBook } from './book'
import type { PatternRef } from './own'
import type { LeftFigureId, RightFigureId } from './types'

/**
 * How the hands accompany: a pattern, a figure of its own for either hand over it, and the inversion
 * the right hand's chord keeps (`null`: each chord voice-led from the last).
 */
export interface Accompaniment {
  readonly pattern: PatternRef
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  readonly inversion: Inversion | null
}

/** A pattern as the Player's Setup chooses it: one for every chord, or From the chart (the chart's own methods). */
export type PatternChoice = PatternRef | 'chart'

/** An accompaniment as the Player's Setup chooses it: its pattern may be From the chart. */
export interface AccompanimentChoice extends Omit<Accompaniment, 'pattern'> {
  readonly pattern: PatternChoice
}

/**
 * An accompaniment as `arrange` takes it: the book's pattern, each hand's own figure laid over it.
 * Its pattern was read against the book (`playablePattern`).
 */
export function accompanimentOptions(
  book: PatternBook,
  { pattern, rh, lh, inversion }: Accompaniment,
): Pick<ArrangeOptions, 'pattern' | 'rh' | 'lh' | 'inversion'> {
  return {
    pattern: book.require(pattern).pattern,
    ...(rh ? { rh: RIGHT_FIGURES[rh].figure } : {}),
    ...(lh ? { lh: LEFT_FIGURES[lh].figure } : {}),
    ...(inversion === null ? {} : { inversion }),
  }
}
