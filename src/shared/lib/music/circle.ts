import { tonicSpelling, type Key } from './key'
import { pitchClassOf, sameNote } from './note'
import { pitchClass } from './pitch'
import { scaleChords } from './scale-chord'

/** One place on the circle of fifths: a major key outside, its relative minor inside. */
export interface CirclePlace {
  readonly major: Key
  readonly minor: Key
}
export type CircleRing = keyof CirclePlace

/** The twelve places clockwise from C, each a fifth above the one before, tonics spelled as the app spells them. */
export const CIRCLE_OF_FIFTHS: readonly CirclePlace[] = Array.from({ length: 12 }, (_, i) => {
  const major = pitchClass(7 * i)
  return {
    major: { tonic: tonicSpelling(major, false), minor: false },
    minor: { tonic: tonicSpelling(pitchClass(major - 3), true), minor: true },
  }
})

/** Where one of a key's chords sits on the circle, with its numeral. */
export interface CircleFunction {
  readonly place: number
  readonly ring: CircleRing
  readonly numeral: string
}

/**
 * A key's seven triads on the circle, in degree order: a major triad on its major key's place, a
 * minor or diminished one on its minor key's (C's vii°, B°, inside D).
 */
export function circleFunctions(key: Key): CircleFunction[] {
  return scaleChords(key.tonic, key.minor ? 'natural' : 'major', 3).flatMap((chord) => {
    const ring: CircleRing = chord.tones[1]?.semitones === 3 ? 'minor' : 'major'
    const pc = pitchClassOf(chord.root)
    const place = CIRCLE_OF_FIFTHS.findIndex((at) => pitchClassOf(at[ring].tonic) === pc)
    return place < 0 ? [] : [{ place, ring, numeral: chord.roman }]
  })
}

/** Whether two keys are one: the same tonic, spelled alike, and the same mode. */
export const sameKey = (a: Key, b: Key): boolean =>
  a.minor === b.minor && sameNote(a.tonic, b.tonic)

/** One of the circle's 24 keys but `current`, as `random` (0 ≤ r < 1) picks it. */
export function randomKey(random: () => number, current: Key): Key {
  const keys = CIRCLE_OF_FIFTHS.flatMap((place) => [place.major, place.minor]).filter(
    (key) => !sameKey(key, current),
  )
  const picked = keys[Math.min(keys.length - 1, Math.floor(random() * keys.length))]
  if (!picked) throw new RangeError('The circle has no other key')
  return picked
}
