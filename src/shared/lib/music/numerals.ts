import {
  qualityIntervals,
  qualitySuffix,
  qualityWithIntervals,
  type Chord,
  type ChordQuality,
} from './chord'
import { readQualitySuffix } from './chord-symbol'
import { spellAbove } from './interval'
import type { Key } from './key'
import { letterIndex, pitchClassOf, plainRoot, type SpelledNote } from './note'
import { pitchClass } from './pitch'
import { keyScale, spellScale } from './scale'
import { scaleChordAt, scaleChords, SIZE_NOTES, type ChordSize } from './scale-chord'
import { availableTensions } from './tensions'
import type { Tone } from './tone'

/**
 * A Roman numeral read: its degree of the key's scale, a chromatic shift, and the chord on it, any of
 * the table's. A plain triad grows with a progression's chord size; any other chord is played as it
 * is written.
 */
export interface Numeral {
  readonly degree: number
  readonly shift: -1 | 0 | 1
  readonly quality: ChordQuality
}

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const
const TOKEN = /^([b♭#♯]?)(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)(.*)$/
const SHIFTS = new Map<string, -1 | 0 | 1>([
  ['', 0],
  ['b', -1],
  ['♭', -1],
  ['#', 1],
  ['♯', 1],
])

/**
 * What a lower-case numeral writes after it, for each chord of the table with a minor 3rd: a minor
 * chord's suffix without its `m`, a diminished one's mark.
 */
const LOWER_TAILS: ReadonlyMap<ChordQuality, string> = new Map<ChordQuality, string>([
  ['min', ''],
  ['m6', '6'],
  ['m69', '6/9'],
  ['m7', '7'],
  ['mM7', 'Maj7'],
  ['m9', '9'],
  ['mM9', 'Maj9'],
  ['m11', '11'],
  ['dim', '°'],
  ['o7', '°7'],
  ['hd', 'ø7'],
  ['hd9', 'ø9'],
])
const LOWER_QUALITIES = new Map([...LOWER_TAILS].map(([quality, tail]) => [tail, quality] as const))
/** Other ways a lower-case numeral's tail is typed. */
const TAIL_ALIASES: ReadonlyMap<string, string> = new Map([
  ['o', '°'],
  ['o7', '°7'],
  ['ø', 'ø7'],
  ['maj7', 'Maj7'],
  ['M7', 'Maj7'],
  ['maj9', 'Maj9'],
  ['M9', 'Maj9'],
])

type PlainTriad = 'maj' | 'min' | 'dim' | 'aug'

/** The 7th chord a plain triad that is not the key's own grows to: a major chord a dominant, a minor one a minor 7th. */
const GROWN_SEVENTH: Readonly<Record<PlainTriad, ChordQuality>> = {
  maj: 'd7',
  min: 'm7',
  dim: 'hd',
  aug: 's5',
}

const isPlainTriad = (quality: ChordQuality): quality is PlainTriad => quality in GROWN_SEVENTH

/** How far above a root the key's next note lies, as a 9th: a ♭9 where it is a semitone up, else a 9. */
function keyNinth(root: SpelledNote, scale: readonly Tone[]): number {
  const above = (letterIndex(root.letter) + 1) % 7
  const next = scale.find((tone) => letterIndex(tone.note.letter) === above)
  return next && pitchClass(next.pitchClass - pitchClassOf(root)) === 1 ? 13 : 14
}

/** A 7th chord grown to the 9th the key has over it, where the chord takes that 9th and the table has the chord. */
function grownNinth(seventh: ChordQuality, ninth: number): ChordQuality {
  const tension = availableTensions(seventh).find((each) => each.semitones === ninth)
  return (tension && qualityWithIntervals([...qualityIntervals(seventh), tension])) ?? seventh
}

/** A lower-case numeral's chord: by its tail, or by a suffix that itself writes a chord with a minor 3rd (`iim7`). */
function lowerQuality(tail: string): ChordQuality | null {
  const short = LOWER_QUALITIES.get(TAIL_ALIASES.get(tail) ?? tail)
  if (short) return short
  const full = readQualitySuffix(tail)
  return full && LOWER_TAILS.has(full) ? full : null
}

/** A degree as Roman numerals write it, in either case, after a ♭ or ♯: its index from the tonic and its shift. */
export function readDegree(
  sign: string,
  roman: string,
): { readonly degree: number; readonly shift: -1 | 0 | 1 } | null {
  const degree = ROMANS.findIndex((each) => each === roman.toUpperCase())
  const shift = SHIFTS.get(sign)
  return degree < 0 || shift === undefined ? null : { degree, shift }
}

/**
 * One numeral: a degree, then what a chord symbol writes after its root. Upper case takes any chord
 * as the table spells it (`V7`, `IMaj7`, `I6`, `Vsus4`, `III+`, the sheets' `IIm7` and `IVm9`); lower
 * case is a chord with a minor 3rd, its suffix without the `m` (`ii`, `ii7`, `i6`, `ii9`, `iMaj7`),
 * a diminished one by its mark (`vii°`, `vii°7`, `iiø7`).
 */
export function parseNumeral(token: string): Numeral | null {
  const match = TOKEN.exec(token)
  if (!match) return null
  const [, sign = '', roman = '', tail = ''] = match
  const read = readDegree(sign, roman)
  const quality = roman === roman.toUpperCase() ? readQualitySuffix(tail) : lowerQuality(tail)
  return !read || !quality ? null : { ...read, quality }
}

/** A line of numerals apart by spaces, commas, hyphens or dashes; null if any cannot be read, or none is there. */
export function parseNumerals(text: string): Numeral[] | null {
  const tokens = text.split(/[\s,\-–—]+/).filter(Boolean)
  const numerals: Numeral[] = []
  for (const token of tokens) {
    const numeral = parseNumeral(token)
    if (!numeral) return null
    numerals.push(numeral)
  }
  return numerals.length > 0 ? numerals : null
}

/**
 * A numeral as it is written, one way: lower case for a chord with a minor 3rd (`ii7`, `viiø7`,
 * `i6`), upper case with the table's suffix for any other (`♭VII`, `IMaj7`, `V7♭9`, `Vsus4`).
 */
export function numeralText(numeral: Numeral): string {
  const sign = numeral.shift < 0 ? '♭' : numeral.shift > 0 ? '#' : ''
  const roman = ROMANS[numeral.degree] ?? ''
  const tail = LOWER_TAILS.get(numeral.quality)
  return (
    sign +
    (tail === undefined ? roman + qualitySuffix(numeral.quality) : roman.toLowerCase() + tail)
  )
}

/** Numerals as a line to read, a dash between them: `ii–V–I`. */
export const numeralsLine = (numerals: readonly Numeral[]): string =>
  numerals.map(numeralText).join('–')

/** Numerals as a URL holds them: joined by hyphens, flats as `b`. */
export const numeralsParam = (numerals: readonly Numeral[]): string =>
  numerals.map(numeralText).join('-').replaceAll('♭', 'b')

/**
 * A half-diminished chord grown to a 9th: its 9th is the natural one whatever the key has over it
 * (locrian ♮2, the tensions table's), for the key's ♭9 is never played over it.
 */
const withOwnNinth = (quality: ChordQuality): ChordQuality => (quality === 'hd' ? 'hd9' : quality)

/**
 * A numeral's chord in a key at a chord size. Any chord but a plain triad is played as written;
 * a triad that is the key's own chord on its degree grows as the scale's does (`scaleChordAt`: a 9th
 * only where it is available), and any other grows as it is: a major chord to a dominant, a minor one
 * to a minor 7th, then to the 9th the key has over it where the chord takes it (a minor key's V to
 * `7♭9`); a half-diminished chord takes its natural 9th (a minor key's ii to `m9♭5`). A major key
 * counts from the major scale, a minor key from natural minor.
 */
export function numeralChord(numeral: Numeral, key: Key, size: ChordSize): Chord {
  const kind = keyScale(key)
  const scale = spellScale(key.tonic, kind)
  const tone = scale[numeral.degree]
  if (!tone) throw new RangeError(`A scale has no degree ${numeral.degree}`)
  const root = plainRoot(
    numeral.shift === 0 ? tone.note : spellAbove(tone.note, { steps: 0, semitones: numeral.shift }),
  )
  const { quality } = numeral
  if (!isPlainTriad(quality)) return { root, quality }
  const own = scaleChords(key.tonic, kind, 3)[numeral.degree]?.quality
  if (numeral.shift === 0 && own === quality) {
    const grown = scaleChordAt(key.tonic, kind, numeral.degree, SIZE_NOTES[size])
    return size === 'ninths' ? { ...grown, quality: withOwnNinth(grown.quality) } : grown
  }
  if (size === 'triads') return { root, quality }
  const seventh = GROWN_SEVENTH[quality]
  if (size === 'sevenths') return { root, quality: seventh }
  return { root, quality: withOwnNinth(grownNinth(seventh, keyNinth(root, scale))) }
}

/** A chord as its numeral in a key (Am in C is vi, C6 is I6); none where its root is more than a semitone from its degree. */
export function numeralOf(chord: Chord, key: Key): Numeral | null {
  const degree = (letterIndex(chord.root.letter) - letterIndex(key.tonic.letter) + 7) % 7
  const tone = spellScale(key.tonic, keyScale(key))[degree]
  if (!tone) return null
  const distance = pitchClass(pitchClassOf(chord.root) - tone.pitchClass)
  const shift = distance === 0 ? 0 : distance === 1 ? 1 : distance === 11 ? -1 : null
  return shift === null ? null : { degree, shift, quality: chord.quality }
}
