import {
  numeralChord,
  parseChordSymbol,
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
  /** The symbol as a lesson writes it (C2 and Cadd9 are one chord to the kernel); else its own. */
  readonly symbol?: string
}

/** A lesson's row of chord symbols, each written as the lesson writes it. */
export const symbolsRow = (symbols: readonly string[]): RowChord[] =>
  symbols.map((symbol) => ({ chord: parseChordSymbol(symbol), symbol }))

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
