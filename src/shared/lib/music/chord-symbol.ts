import {
  CHORD_QUALITIES,
  chordBass,
  qualitySpellings,
  type Chord,
  type ChordQuality,
} from './chord'
import { parseNoteName } from './note'

export class ChordSymbolError extends Error {
  override readonly name = 'ChordSymbolError'
  readonly symbol: string

  constructor(symbol: string) {
    super(`Unknown chord symbol "${symbol}"`)
    this.symbol = symbol
  }
}

/** ASCII and typographic forms compare equal: `m7b5` is `m7♭5`, `m7(-5)` is `m7(−5)`. */
const normalise = (suffix: string): string =>
  suffix.replaceAll('♭', 'b').replaceAll('♯', '#').replaceAll('−', '-')

/**
 * A chord symbol as it is engraved over a staff (LilyPond's and MuseScore's chord names): `#` as ♯,
 * and `b` as ♭ after a note's letter (`Bb`, `/Eb`) or before a degree (`b9`). The text read and
 * stored keeps its ASCII.
 */
export const printedSymbol = (symbol: string): string =>
  symbol.replaceAll('#', '♯').replace(/(?<=[A-G])b|b(?=\d)/g, '♭')

const QUALITY_BY_SUFFIX = new Map<string, ChordQuality>(
  CHORD_QUALITIES.flatMap((quality) =>
    qualitySpellings(quality).map((spelling) => [normalise(spelling), quality] as const),
  ),
)

/** The chord a suffix writes, in any of its spellings (`m7b5`, `maj7`, none for major); null for one the table lacks. */
export const readQualitySuffix = (suffix: string): ChordQuality | null =>
  QUALITY_BY_SUFFIX.get(normalise(suffix)) ?? null

/** Root lengths tried, longest first: `F##`, `Bbb` and `F𝄪` take three code units. */
const ROOT_LENGTHS = [3, 2, 1]

/**
 * Reads `F#m7b5/C`: a root, a quality suffix in any of its spellings, and an optional bass after the
 * last slash. A bass that is a chord tone is spelled as that tone (`F#m/Db` → `F#m/C#`), unless
 * that writes it oddly (`D#/G` keeps its G, not F𝄪).
 */
export function parseChordSymbol(symbol: string): Chord {
  const slash = symbol.lastIndexOf('/')
  const bass = slash > 0 ? parseNoteName(symbol.slice(slash + 1)) : null
  // `6/9` and `7(−9/+5)` keep their slash: only a note name after it makes a bass.
  const head = bass ? symbol.slice(0, slash) : symbol
  for (const length of ROOT_LENGTHS) {
    const root = parseNoteName(head.slice(0, length))
    const quality = readQualitySuffix(head.slice(length))
    if (!root || !quality) continue
    return bass ? { root, quality, bass: chordBass(root, quality, bass) } : { root, quality }
  }
  throw new ChordSymbolError(symbol)
}

/** A chord as a learner types it, spaces around it left out; null while it cannot be read (mid-word, a symbol the table lacks). */
export function readChordSymbol(typed: string): Chord | null {
  try {
    return parseChordSymbol(typed.trim())
  } catch (error) {
    if (error instanceof ChordSymbolError) return null
    throw error
  }
}

/** A line of chords as a learner types it: the chords read, and the words that cannot be. */
export interface ChordLine {
  readonly chords: readonly Chord[]
  readonly unread: readonly string[]
}

/** A line's chords where every word of it is one and it has one; null for any other line. */
export function chordsOfLine(text: string): readonly Chord[] | null {
  const { chords, unread } = readChordLine(text)
  return chords.length > 0 && unread.length === 0 ? chords : null
}

/** Reads `Dm7, G7 | C`: chords apart by spaces, commas or bar lines; a hyphen stays a chord's minus. */
export function readChordLine(text: string): ChordLine {
  const chords: Chord[] = []
  const unread: string[] = []
  for (const word of text.split(/[\s,|]+/).filter(Boolean)) {
    const chord = readChordSymbol(word)
    if (chord) chords.push(chord)
    else unread.push(word)
  }
  return { chords, unread }
}
