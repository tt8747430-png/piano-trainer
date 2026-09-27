import { PAINT } from '@/shared/ui'
import type { StepKind } from './use-step-title'

/**
 * Each kind of step in its own paint: the paint's wash as the fill (a step's tile, the Continue
 * card's band) and its deep shade as the ink of an icon on it.
 */
export const STEP_PAINT: Readonly<Record<StepKind, (typeof PAINT)[keyof typeof PAINT]>> = {
  chords: PAINT.sand,
  scale: PAINT.sky,
  study: PAINT.grass,
  song: PAINT.yellow,
  progression: PAINT.lilac,
}
