import { noteName, plainSpelling } from './note'
import { midi, pitchClass, type Midi } from './pitch'

export const MIDDLE_C: Midi = midi(60)

const BLACK = new Set([1, 3, 6, 8, 10])

export const isBlackKey = (key: Midi): boolean => BLACK.has(pitchClass(key))

/** A key's octave in scientific pitch: C4 is middle C, B3 the key below it. */
export const octaveOf = (key: Midi): number => Math.floor(key / 12) - 1

/** A key's name as printed: its note, sharp on a black key, and its octave ("C#4"). */
export const printedKeyName = (key: Midi): string =>
  `${noteName(plainSpelling(pitchClass(key), true))}${octaveOf(key)}`

/** A stretch of the keyboard, both ends included. */
export interface KeyRange {
  readonly from: Midi
  readonly to: Midi
}

/** Every key of a piano, A0 to C8: what a keyboard scrolls through. */
export const PIANO: KeyRange = { from: midi(21), to: midi(108) }

/** The piano's 52 white keys, A0 to C8, low to high: what a strip of the 88 is measured in. */
export const WHITE_KEYS: readonly Midi[] = Array.from({ length: 88 }, (_, at) =>
  midi(21 + at),
).filter((key) => !isBlackKey(key))

/** Two octaves up from middle C: what the explorers show at least. */
export const MIDDLE_OCTAVES: KeyRange = { from: MIDDLE_C, to: midi(83) }

/** The stretch from the lowest of the keys to the highest; none for no keys. */
export function rangeOf(keys: readonly Midi[]): KeyRange | undefined {
  if (keys.length === 0) return undefined
  return { from: midi(Math.min(...keys)), to: midi(Math.max(...keys)) }
}

/**
 * `least`, grown as far as the keys need: down to the C at or below the lowest key, up to the B at
 * or above the highest. Keys inside `least` leave it as it is.
 */
export function keyboardRange(keys: readonly Midi[], least: KeyRange): KeyRange {
  if (keys.length === 0) return least
  const low = Math.min(...keys)
  const high = Math.max(...keys)
  return {
    from: low < least.from ? midi(low - pitchClass(low)) : least.from,
    to: high > least.to ? midi(high + 11 - pitchClass(high)) : least.to,
  }
}

/** The keys a page's boards draw round one key on a phone and on a laptop. */
export interface KeysAround {
  readonly phone: KeyRange
  readonly laptop: KeyRange
}

/**
 * The keys from `below` under `key` to `above` over it, on a phone and on a laptop, as a page's
 * boards draw them (Scales: a fifth under the tonic to a twelfth over it on a phone).
 */
export const keysAround = (
  key: number,
  phone: readonly [below: number, above: number],
  laptop: readonly [below: number, above: number],
): KeysAround => ({
  phone: whiteEnds(key - phone[0], key + phone[1]),
  laptop: whiteEnds(key - laptop[0], key + laptop[1]),
})

/** A stretch of keys from `from` to `to`, an end on a black key moved down to the white under it, so the stretch keeps its count of white keys. */
const whiteEnds = (from: number, to: number): KeyRange => ({
  from: midi(isBlackKey(midi(from)) ? from - 1 : from),
  to: midi(isBlackKey(midi(to)) ? to - 1 : to),
})
