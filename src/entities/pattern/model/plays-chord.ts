import type { EventFigure, Figure, FigureEvent } from '@/shared/lib/arrangement'
import { RIGHT_FIGURES } from '../content/figures'
import type { AccompanimentChoice } from './accompaniment'
import type { PatternBook } from './book'
import type { PatternRef } from './own'

/** The tokens that play the chord as it is voiced (`C`, `vN`): an inversion moves them. */
const VOICED = new Set(['chord', 'voice'])

const voices = (events: readonly FigureEvent[] | undefined) =>
  events?.some((event) => event.tones.some((tone) => VOICED.has(tone.token.kind))) ?? false

const voicesChord = (figure: EventFigure) =>
  voices(figure.events) || voices(figure.inThree) || voices(figure.onMajor)

/**
 * Whether a right hand plays the chord as it is voiced, so an inversion changes what it plays; one
 * that plays its own shapes (triads from the root, the key's triads) or the tune does not, unless
 * its figuration between a line's ends does.
 */
export function playsChord(figure: Figure): boolean {
  if (figure.kind === 'events') return voicesChord(figure)
  return figure.use === 'ends' && voicesChord(figure.between)
}

/**
 * Whether this accompaniment follows an inversion (it changes what it plays): its right hand's own
 * figure decides, else the pattern's; From the chart, any of the patterns the chart plays (`chart`).
 */
export function followsInversion(
  book: PatternBook,
  { pattern, rh }: Pick<AccompanimentChoice, 'pattern' | 'rh'>,
  chart: readonly PatternRef[] = [],
): boolean {
  if (rh) return playsChord(RIGHT_FIGURES[rh].figure)
  const plays = (ref: PatternRef) => {
    const entry = book.get(ref)
    return entry !== undefined && playsChord(entry.pattern.rh)
  }
  return pattern === 'chart' ? chart.some(plays) : plays(pattern)
}
