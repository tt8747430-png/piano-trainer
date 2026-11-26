import { chordBass, chordSymbol, kindOfParts, type Chord, type ChordKind } from './chord'
import { readSuffixParts } from './chord-grammar'
import { CHORD_QUALITIES, qualitySpellings, type ChordQuality } from './chord-quality'
import { noteName, parseNoteName, type SpelledNote } from './note'

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

/** A chord's symbol as a chord sheet sets it: its root, its quality's letters, the numbers and alterations raised, its bass. */
export interface SymbolParts {
  /** `C`, `F♯`, `B♭`. */
  readonly root: string
  /** The quality's letters, on the line: `m`, `maj`, `dim`. */
  readonly letters: string
  /** Its numbers and alterations, raised: `7`, `7♭5`, `sus4`, `add9`; empty for none. */
  readonly raised: string
  /** The bass after its slash, `/G`; empty for none. */
  readonly bass: string
}

/**
 * A symbol in its parts as printed (`printedSymbol`), the reference apps' and the Real Book's
 * setting: `C♯m7♭5/G` is C♯ · m · 7♭5 · /G, raised from the first number or alteration on.
 */
export function symbolParts(symbol: string): SymbolParts {
  const [chord = '', bass = ''] = printedSymbol(symbol).split('/')
  const root = /^[A-G][♯♭𝄪𝄫]*/u.exec(chord)?.[0] ?? ''
  const quality = chord.slice(root.length)
  const [, letters = '', raised = ''] = /^([a-zA-Z°ø+]*?)((?:[♯♭]?\d|\(|sus|add|alt).*)?$/u.exec(
    quality,
  ) ?? [quality, quality, '']
  return { root, letters, raised, bass: bass ? `/${bass}` : '' }
}

/** A note's name as it is printed (`printedSymbol` of `noteName`): `C♯`, `B♭`. */
export const printedNote = (spelled: SpelledNote): string => printedSymbol(noteName(spelled))

/** A chord's symbol as it is printed (`printedSymbol` of `chordSymbol`): `C♯m7`, `D/F♯`. */
export const printedChord = (chord: Chord): string => printedSymbol(chordSymbol(chord))

const QUALITY_BY_SUFFIX = new Map<string, ChordQuality>(
  CHORD_QUALITIES.flatMap((quality) =>
    qualitySpellings(quality).map((spelling) => [normalise(spelling), quality] as const),
  ),
)

/**
 * The chord a suffix writes, in any of its spellings (`m7b5`, `maj7`, `9#11`, `7(#5,#9)`, none for
 * major): the table's quality where the table has the chord, else the builder's parts, read by its
 * grammar; null for a suffix neither reads.
 */
export function readQualitySuffix(suffix: string): ChordKind | null {
  const quality = QUALITY_BY_SUFFIX.get(normalise(suffix))
  if (quality) return quality
  const parts = readSuffixParts(suffix)
  return parts ? kindOfParts(parts) : null
}

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

/**
 * Chords a learner types in lower case (`dm7`, `c/e`, `dm7 g7 c`) as they are written: a word's
 * leading a–g, and a bass's after its slash, in capitals. For a field or search that holds only
 * chords; a chord sheet's lyrics keep their words.
 */
export function rootsInCapitals(typed: string): string {
  return typed.replace(
    /(^|[\s,|/])([a-g])/g,
    (_, before: string, letter: string) => before + letter.toUpperCase(),
  )
}

/** A chord as a learner types it, spaces around it left out; null while it cannot be read (mid-word, a chord the builder does not make). */
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

/** A chord in a line: anything but a space, comma or bar line, and whatever its brackets hold (`C7(♭5,♭9)`). */
const CHORD_WORD = /(?:[^\s,|(]|\([^)]*\)|\()+/g

/** Reads `Dm7, G7 | C`: chords apart by spaces, commas or bar lines; a hyphen stays a chord's minus. */
export function readChordLine(text: string): ChordLine {
  const chords: Chord[] = []
  const unread: string[] = []
  for (const word of text.match(CHORD_WORD) ?? []) {
    const chord = readChordSymbol(word)
    if (chord) chords.push(chord)
    else unread.push(word)
  }
  return { chords, unread }
}
