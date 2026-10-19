import type { ArrangeOptions } from '@/shared/lib/arrangement'
import type { Inversion } from '@/shared/lib/music'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import type { PatternBook } from './book'
import { followsInversion } from './plays-chord'
import type { PatternRef } from './own'
import type { LeftFigureId, RightFigureId } from './types'

/**
 * How the hands accompany: a pattern, a figure of its own for either hand over it, and where the
 * right hand's chord stands: the first chord's inversion (`null`: root position), each after it
 * nearest the last or, without `nearest`, in that inversion too.
 */
export interface Accompaniment {
  readonly pattern: PatternRef
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  readonly inversion: Inversion | null
  readonly nearest: boolean
}

/** A pattern as the Player's Setup chooses it: one for every chord, or From the chart (the chart's own methods). */
export type PatternChoice = PatternRef | 'chart'

/** An accompaniment as the Player's Setup chooses it: its pattern may be From the chart. */
export interface AccompanimentChoice extends Omit<Accompaniment, 'pattern'> {
  readonly pattern: PatternChoice
}

/**
 * An accompaniment as `arrange` takes it: the book's pattern, each hand's own figure laid over it.
 * Its pattern was read against the book (`playablePattern`). From the chart, `chart` holds the
 * patterns the chart plays, `pattern` the one under a chord that names no method.
 */
export function accompanimentOptions(
  book: PatternBook,
  { pattern, rh, lh, inversion, nearest }: Accompaniment,
  chart?: readonly PatternRef[],
): Pick<ArrangeOptions, 'pattern' | 'rh' | 'lh' | 'inversion' | 'nearest'> {
  return {
    pattern: book.require(pattern).pattern,
    ...(rh ? { rh: RIGHT_FIGURES[rh].figure } : {}),
    ...(lh ? { lh: LEFT_FIGURES[lh].figure } : {}),
    // A position only where the pattern follows it: one that plays its own shapes, where the
    // Setup's position is faded, plays as though none were chosen.
    ...(followsInversion(book, { pattern: chart ? 'chart' : pattern, rh }, chart)
      ? { inversion: inversion ?? 0, nearest }
      : {}),
  }
}
