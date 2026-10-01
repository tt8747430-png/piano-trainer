import { playsKeyTriads, splitsTheBeat, type Figure } from '@/shared/lib/arrangement'
import { PATTERNS } from '../content/patterns'
import type { PatternChoice } from './accompaniment'
import type { FigureEntry, PatternId } from './types'

/** What a pattern or figure may need that not all music has, in the order a closed one names it. */
export const FIGURE_NEEDS = ['melody', 'key', 'simpleTime'] as const
export type FigureNeed = (typeof FIGURE_NEEDS)[number]

/**
 * What the music the Player plays has for its patterns and figures: a chart that names its own
 * methods (From the chart), a tune, a key, and a beat in two (not 6/8 or 12/8).
 */
export interface PatternFit extends Readonly<Record<FigureNeed, boolean>> {
  readonly methodCodes: boolean
}

const NEEDS: Readonly<Record<FigureNeed, (figure: Figure) => boolean>> = {
  melody: (figure) => figure.kind === 'melody',
  key: playsKeyTriads,
  simpleTime: splitsTheBeat,
}

const unmet = (figures: readonly Figure[], fit: PatternFit): FigureNeed | null =>
  FIGURE_NEEDS.find((need) => !fit[need] && figures.some(NEEDS[need])) ?? null

/** What a figure needs that the music lacks, or null where it can play. */
export const figureNeed = (figure: Figure, fit: PatternFit): FigureNeed | null =>
  unmet([figure], fit)

/** What a pattern needs, in either hand, that the music lacks, or null where it can play. */
export const patternNeed = (id: PatternId, fit: PatternFit): FigureNeed | null =>
  unmet([PATTERNS[id].pattern.rh, PATTERNS[id].pattern.lh], fit)

/**
 * The pattern the URL names where the music can play it, else the music's own. From the chart is a
 * chart's own methods, so it plays only where it is the music's own.
 */
export function playablePattern<Own extends PatternChoice>(
  named: PatternChoice | undefined,
  own: Own,
  fit: PatternFit,
): Own | PatternId {
  if (named === undefined || named === 'chart') return own
  return patternNeed(named, fit) === null ? named : own
}

/** The figure the URL names for a hand where the music can play it, else null: the pattern's own. */
export function playableFigure<Id extends string>(
  id: Id | undefined,
  figures: Readonly<Record<Id, FigureEntry<Figure>>>,
  fit: PatternFit,
): Id | null {
  return id !== undefined && figureNeed(figures[id].figure, fit) === null ? id : null
}
