import type { Finger } from '@/shared/lib/music'

/** The hands at the keys: the right and the left. */
export type Side = 'rh' | 'lh'

/** A hand's fingers, the thumb first: the score's 1 to 5. */
export const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const
export type FingerName = (typeof FINGERS)[number]

/** The finger a score's number names. */
export const fingerName = (finger: Finger): FingerName => FINGERS[finger - 1] ?? 'middle'

/**
 * A finger's three angles, in radians: the thumb's spread, its swing out from the palm and its bend;
 * another finger's knuckle bend, middle-joint bend and spread.
 */
export type Angles = readonly [number, number, number]

/**
 * Where a finger rests across the keys from the hand's place (its middle finger's), in white keys:
 * a five-finger position, the right hand's thumb lowest and the left's highest.
 */
export const restingPlace = (side: Side, finger: Finger): number =>
  (side === 'rh' ? 1 : -1) * (finger - 3)
