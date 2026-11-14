import { tonicSpelling, type Key } from './key'
import { pitchClassOf, sameNote } from './note'
import { pitchClass, type PitchClass } from './pitch'
import { relativeKey } from './scale'

/** One place on the circle of fifths: a major key outside, its relative minor inside. */
export interface CirclePlace {
  readonly major: Key
  readonly minor: Key
}
export type CircleRing = keyof CirclePlace

/**
 * The twelve places clockwise from C, each a fifth above the one before: the major spelled as the
 * app spells tonics, its relative minor by letters from it, so both share a signature (F♯ over D♯m).
 */
export const CIRCLE_OF_FIFTHS: readonly CirclePlace[] = Array.from({ length: 12 }, (_, i) => {
  const major: Key = { tonic: tonicSpelling(pitchClass(7 * i), false), minor: false }
  return { major, minor: relativeKey(major) }
})

/** The key on this tonic and mode as the circle spells it. */
export function circleKey(pc: PitchClass, minor: boolean): Key {
  const ring: CircleRing = minor ? 'minor' : 'major'
  const place = CIRCLE_OF_FIFTHS.find((at) => pitchClassOf(at[ring].tonic) === pc)
  if (!place) throw new RangeError(`The circle has every key, not ${pc}`)
  return place[ring]
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
