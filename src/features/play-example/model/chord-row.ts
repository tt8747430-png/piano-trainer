import {
  numeralChord,
  numeralText,
  type Chord,
  type ChordSize,
  type Key,
  type Numeral,
} from '@/shared/lib/music'

/** A chord of a row, with what is written under its symbol (a progression's numeral). */
export interface RowChord {
  readonly chord: Chord
  readonly caption?: string
}

/** A progression's chords in a key and size, each captioned by its numeral. */
export const progressionRow = (
  numerals: readonly Numeral[],
  key: Key,
  size: ChordSize,
): RowChord[] =>
  numerals.map((numeral) => ({
    chord: numeralChord(numeral, key, size),
    caption: numeralText(numeral),
  }))
