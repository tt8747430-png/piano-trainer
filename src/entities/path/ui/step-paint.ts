import type { StepKind } from './use-step-title'

/**
 * Each kind of step in its own paint: the paint's wash as the fill (a step's tile, the Continue
 * card's band) and its deep shade as the ink of an icon on it.
 */
export const STEP_PAINT: Readonly<Record<StepKind, { fill: string; ink: string }>> = {
  chords: { fill: 'bg-paint-sand', ink: 'text-on-paint-sand' },
  scale: { fill: 'bg-paint-sky', ink: 'text-on-paint-sky' },
  study: { fill: 'bg-paint-grass', ink: 'text-on-paint-grass' },
  song: { fill: 'bg-paint-yellow', ink: 'text-on-paint-yellow' },
  progression: { fill: 'bg-paint-lilac', ink: 'text-on-paint-lilac' },
}
