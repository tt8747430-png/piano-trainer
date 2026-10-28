import {
  harmonicFunction,
  nashvilleNumber,
  rootMove,
  numeralChord,
  parseChordSymbol,
  numeralText,
  type Chord,
  type ChordSize,
  type ChurchMode,
  type HarmonicFunction,
  type Key,
  type Numeral,
  type RootMove,
} from '@/shared/lib/music'

/** A chord of a row, with what is written under its symbol (a progression's numeral). */
export interface RowChord {
  readonly chord: Chord
  readonly caption?: string
  /** The symbol as a lesson writes it (C2 and Cadd9 are one chord to the kernel); else its own. */
  readonly symbol?: string
  /** What is said under it where the row says no position: a chord out of the key. */
  readonly detail?: string
  /** What it does in its key, where the row is a progression read in one. */
  readonly function?: HarmonicFunction
}

/** A lesson's row of chord symbols, each written as the lesson writes it. */
export const symbolsRow = (symbols: readonly string[]): RowChord[] =>
  symbols.map((symbol) => ({ chord: parseChordSymbol(symbol), symbol }))

/** How a progression's row names its chords: numerals, Nashville numbers, or the chords alone. */
export type RowNames = 'numerals' | 'nashville' | 'chords'

/**
 * A progression's chords in a key and size, grown as its church mode grows them where it has one, each
 * captioned by its numeral (or its Nashville number, or nothing but its symbol), with what it does there.
 */
export const progressionRow = (
  numerals: readonly Numeral[],
  key: Key,
  size: ChordSize,
  { mode, names = 'numerals' }: { mode?: ChurchMode | undefined; names?: RowNames } = {},
): RowChord[] =>
  numerals.map((numeral) => {
    const chord = numeralChord(numeral, key, size, mode)
    const caption =
      names === 'numerals'
        ? numeralText(numeral)
        : names === 'nashville'
          ? nashvilleNumber(chord, key)
          : undefined
    return {
      chord,
      ...(caption === undefined ? {} : { caption }),
      function: harmonicFunction(numeral, key.minor),
    }
  })

/** How each chord's root moved from the one before it; none for the first, or where the letter stays. */
export const rowMoves = (chords: readonly RowChord[]): (RootMove | null)[] =>
  chords.map(({ chord }, place) => {
    const before = chords[place - 1]
    return before ? rootMove(before.chord.root, chord.root) : null
  })
