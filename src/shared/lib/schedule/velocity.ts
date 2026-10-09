/** A tap's and a typed key's velocity: today's loudness. */
export const HAND_VELOCITY = 100

/** How the app hears a MIDI keyboard's velocities (spec 2026-10-09 §3.5). */
export const TOUCHES = ['light', 'normal', 'heavy'] as const
export type Touch = (typeof TOUCHES)[number]

/** The loudest key's gain, struck at 127: the arranged music's notes sound about 0.1–0.2. */
const LOUDEST = 0.3

const TOUCH_EXPONENT: Readonly<Record<Touch, number>> = { light: 0.7, normal: 1, heavy: 1.4 }

const velocityIn = (value: number): number => Math.min(127, Math.max(1, Math.round(value)))

/** How loud a key struck at `velocity` (1–127) sounds: as the square of the velocity, as a piano's. */
export const velocityGain = (velocity: number): number => LOUDEST * (velocity / 127) ** 2

/**
 * A velocity as the Touch hears it: Light raises soft ones, Heavy lowers them, by a curve over the
 * range 1–127, so 1 and 127 stay.
 */
export const touchVelocity = (velocity: number, touch: Touch): number =>
  velocityIn(1 + 126 * ((velocityIn(velocity) - 1) / 126) ** TOUCH_EXPONENT[touch])

/** The velocity a note's gain was struck at: `velocityGain` turned round. */
export const gainVelocity = (gain: number): number => velocityIn(127 * Math.sqrt(gain / LOUDEST))
