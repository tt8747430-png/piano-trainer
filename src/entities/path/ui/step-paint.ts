import type { Paint } from '@/shared/ui'
import type { StepKind } from './use-step-title'

/**
 * Each kind of step in its own paint (DESIGN: chords sand, scale sky, study grass, song yellow,
 * progression lilac), wherever a step or a piece of its kind is shown: a step's tile, the Continue
 * card's band, a row that leads to it.
 */
export const STEP_PAINT: Readonly<Record<StepKind, Paint>> = {
  chords: 'sand',
  scale: 'sky',
  study: 'grass',
  song: 'yellow',
  progression: 'lilac',
}
