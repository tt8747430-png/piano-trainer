import { midi, pitchClass, type Midi } from './pitch'

export const MIDDLE_C: Midi = midi(60)

const BLACK = new Set([1, 3, 6, 8, 10])

export const isBlackKey = (key: Midi): boolean => BLACK.has(pitchClass(key))

/** A stretch of the keyboard, both ends included. */
export interface KeyRange {
  readonly from: Midi
  readonly to: Midi
}

/** Every key of a piano, A0 to C8: what a keyboard scrolls through. */
export const PIANO: KeyRange = { from: midi(21), to: midi(108) }

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
    from: midi(Math.min(least.from, low - pitchClass(low))),
    to: midi(Math.max(least.to, high + 11 - pitchClass(high))),
  }
}
