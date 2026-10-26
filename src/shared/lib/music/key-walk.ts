import { transposedKey, type Key } from './key'

/** The ways a progression walks through the keys, each ending back home. */
export const KEY_WALKS = [
  'semitones-up',
  'semitones-down',
  'semitones-up-down',
  'tones-up',
  'tones-down',
  'fifths',
  'fifths-up',
  'minor-thirds',
  'major-thirds',
] as const
export type KeyWalk = (typeof KEY_WALKS)[number]

/**
 * Each walk's step in semitones and how many keys it visits before home: `fifths` round the circle a
 * 5th lower each time (C F B♭, the way a ii–V–I resolves), `fifths-up` a 5th higher (C G D); the
 * thirds split the octave in four or three. A walk `back` comes down the way it went up.
 */
const STEPS: Readonly<
  Record<KeyWalk, { readonly by: number; readonly keys: number; readonly back?: true }>
> = {
  'semitones-up': { by: 1, keys: 12 },
  'semitones-down': { by: -1, keys: 12 },
  'semitones-up-down': { by: 1, keys: 12, back: true },
  'tones-up': { by: 2, keys: 6 },
  'tones-down': { by: -2, keys: 6 },
  fifths: { by: 5, keys: 12 },
  'fifths-up': { by: 7, keys: 12 },
  'minor-thirds': { by: 3, keys: 4 },
  'major-thirds': { by: 4, keys: 3 },
}

/**
 * The keys a walk plays a progression in, from `key` back to it: each a step on, a minor key staying
 * minor, each tonic spelled by the key's one rule; a walk that comes back, up to `key` again and down
 * the same keys home (Gorshkov's «вверх и вниз»).
 */
export function walkKeys(key: Key, walk: KeyWalk): Key[] {
  const { by, keys, back = false } = STEPS[walk]
  const there = Array.from({ length: keys + 1 }, (_, i) => transposedKey(key, by * i))
  return back ? [...there, ...there.slice(0, keys).reverse()] : there
}
