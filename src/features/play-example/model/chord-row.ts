import {
  numeralChord,
  pitchClass,
  spellChord,
  type ChordRole,
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

/** The tones that put a chord in an inversion when lowest in the hand: root position to the 3rd. */
const INVERSION_ROLES: readonly ChordRole[] = ['root', '3rd', '5th', '7th']

/** The tones a rootless hand may start from. */
export type FromTone = Exclude<ChordRole, 'root'>

const isFromTone = (role: ChordRole): role is FromTone => role !== 'root'

/**
 * Where a row voices a chord's hand: its inversion (0 root position, to 3) when the hand holds the
 * root; a rootless hand, the tone it starts from (the 3rd, the 9th…). `keys` is the bass, then the
 * hand.
 */
export function handPosition(
  chord: Chord,
  keys: readonly number[],
): { inversion: number } | { from: FromTone } | null {
  const hand = keys.slice(1)
  if (hand.length === 0) return null
  const tones = spellChord(chord.root, chord.quality)
  const roleOf = (key: number) => tones.find((tone) => tone.pitchClass === pitchClass(key))?.role
  const role = roleOf(Math.min(...hand))
  if (!role) return null
  const holdsRoot = hand.some((key) => roleOf(key) === 'root')
  const inversion = INVERSION_ROLES.indexOf(role)
  if (holdsRoot && inversion >= 0) return { inversion }
  return isFromTone(role) ? { from: role } : null
}
