import type { Figure, FigureEvent } from '@/shared/lib/arrangement'
import { RIGHT_FIGURES } from '../content/figures'
import { PATTERNS } from '../content/patterns'
import type { AccompanimentChoice } from './accompaniment'

/** The tokens that play the chord as it is voiced (`C`, `vN`): an inversion moves them. */
const VOICED = new Set(['chord', 'voice'])

const voices = (events: readonly FigureEvent[] | undefined) =>
  events?.some((event) => event.tones.some((tone) => VOICED.has(tone.token.kind))) ?? false

/**
 * Whether a right hand plays the chord as it is voiced, so an inversion changes what it plays; one
 * that plays its own shapes (triads from the root, the key's triads) or the tune does not.
 */
export function playsChord(figure: Figure): boolean {
  if (figure.kind === 'melody') return false
  return voices(figure.events) || voices(figure.inThree) || voices(figure.onMajor)
}

/**
 * Whether this accompaniment follows an inversion (it changes what it plays): its right hand's own
 * figure decides, else the pattern's; the chart's own plan may play the chord, so it may.
 */
export function followsInversion({
  pattern,
  rh,
}: Pick<AccompanimentChoice, 'pattern' | 'rh'>): boolean {
  if (rh) return playsChord(RIGHT_FIGURES[rh].figure)
  return pattern === 'chart' || playsChord(PATTERNS[pattern].pattern.rh)
}
