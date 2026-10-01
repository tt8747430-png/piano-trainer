import { tonicSpelling, type Key } from './key'
import { pitchClassOf } from './note'
import { pitchClass } from './pitch'

/** The ways a progression walks through the keys, each ending back home. */
export const KEY_WALKS = [
  'semitones-up',
  'semitones-down',
  'tones-up',
  'tones-down',
  'fifths',
] as const
export type KeyWalk = (typeof KEY_WALKS)[number]

/** Each walk's step in semitones and how many keys it visits before home: round the circle, a 5th lower each time. */
const STEPS: Readonly<Record<KeyWalk, { readonly by: number; readonly keys: number }>> = {
  'semitones-up': { by: 1, keys: 12 },
  'semitones-down': { by: -1, keys: 12 },
  'tones-up': { by: 2, keys: 6 },
  'tones-down': { by: -2, keys: 6 },
  fifths: { by: 5, keys: 12 },
}

/**
 * The keys a walk plays a progression in, from `key` back to it: each a step on, a minor key staying
 * minor, each tonic spelled by the key's one rule.
 */
export function walkKeys(key: Key, walk: KeyWalk): Key[] {
  const { by, keys } = STEPS[walk]
  const from = pitchClassOf(key.tonic)
  return Array.from({ length: keys + 1 }, (_, i) =>
    i % keys === 0
      ? key
      : { tonic: tonicSpelling(pitchClass(from + by * i), key.minor), minor: key.minor },
  )
}
