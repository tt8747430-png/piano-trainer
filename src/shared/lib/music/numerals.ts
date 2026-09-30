import type { Chord, ChordQuality } from './chord'
import { spellAbove } from './interval'
import type { Key } from './key'
import { letterIndex, pitchClassOf, plainRoot } from './note'
import { pitchClass } from './pitch'
import { spellScale, type ScaleKind } from './scale'
import { scaleChordAt, scaleChords, SIZE_NOTES, type ChordSize } from './scale-chord'

/** How much of each chord a line of numerals plays, as a progression's chord size does. */

export type NumeralTriad = 'maj' | 'min' | 'dim' | 'aug'
export type NumeralSeventh = 'none' | 'minor' | 'major' | 'diminished' | 'half'

/** A Roman numeral read: its degree of the key's scale, a chromatic shift, its triad, and a 7th if written. */
export interface Numeral {
  readonly degree: number
  readonly shift: -1 | 0 | 1
  readonly triad: NumeralTriad
  readonly seventh: NumeralSeventh
}

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const
const TOKEN = /^([b♭#♯]?)(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)(°|o|ø|\+)?(7|Maj7|maj7|M7)?$/
const SHIFTS = new Map<string, -1 | 0 | 1>([
  ['', 0],
  ['b', -1],
  ['♭', -1],
  ['#', 1],
  ['♯', 1],
])

/** The table's qualities a numeral names, by its triad and 7th: the rest (a 6th, a suspension, a 9th) it does not. */
const NAMED: readonly (readonly [ChordQuality, NumeralTriad, NumeralSeventh])[] = [
  ['maj', 'maj', 'none'],
  ['min', 'min', 'none'],
  ['dim', 'dim', 'none'],
  ['aug', 'aug', 'none'],
  ['d7', 'maj', 'minor'],
  ['m7', 'min', 'minor'],
  ['maj7', 'maj', 'major'],
  ['mM7', 'min', 'major'],
  ['hd', 'dim', 'half'],
  ['o7', 'dim', 'diminished'],
  ['s5', 'aug', 'minor'],
  ['M7s5', 'aug', 'major'],
]

/** What a chord that is not the key's own grows to: a major chord to a dominant, a minor one to a minor 7th. */
const GROWN: Readonly<Record<'sevenths' | 'ninths', Readonly<Record<NumeralTriad, ChordQuality>>>> =
  {
    sevenths: { maj: 'd7', min: 'm7', dim: 'hd', aug: 's5' },
    ninths: { maj: 'n9', min: 'm9', dim: 'hd', aug: 's5' },
  }

const scaleOf = (key: Key): ScaleKind => (key.minor ? 'natural' : 'major')

function triadOf(upper: boolean, mark: string): NumeralTriad | null {
  if (mark === '+') return upper ? 'aug' : null
  if (mark) return upper ? null : 'dim'
  return upper ? 'maj' : 'min'
}

function seventhOf(triad: NumeralTriad, mark: string, written: string): NumeralSeventh | null {
  if (mark === 'ø') return written === '' || written === '7' ? 'half' : null
  if (written === '') return 'none'
  if (written === '7') return triad === 'dim' ? 'diminished' : 'minor'
  return triad === 'dim' ? null : 'major'
}

/** One numeral: `♭VII`, `ii7`, `IMaj7`, `vii°`, `viiø7`, `III+`; upper case major, lower case minor. */
export function parseNumeral(token: string): Numeral | null {
  const match = TOKEN.exec(token)
  if (!match) return null
  const [, sign = '', roman = '', mark = '', written = ''] = match
  const degree = ROMANS.findIndex((each) => each === roman.toUpperCase())
  const shift = SHIFTS.get(sign)
  const triad = triadOf(roman === roman.toUpperCase(), mark)
  const seventh = triad ? seventhOf(triad, mark, written) : null
  return shift === undefined || !triad || !seventh ? null : { degree, shift, triad, seventh }
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

/** A numeral as it is written: `♭VII`, `viiø7`, `IMaj7`. */
export function numeralText(numeral: Numeral): string {
  const sign = numeral.shift < 0 ? '♭' : numeral.shift > 0 ? '#' : ''
  const roman = ROMANS[numeral.degree] ?? ''
  const upper = numeral.triad === 'maj' || numeral.triad === 'aug'
  const mark =
    numeral.triad === 'aug'
      ? '+'
      : numeral.seventh === 'half'
        ? 'ø'
        : numeral.triad === 'dim'
          ? '°'
          : ''
  const seventh = numeral.seventh === 'none' ? '' : numeral.seventh === 'major' ? 'Maj7' : '7'
  return sign + (upper ? roman : roman.toLowerCase()) + mark + seventh
}

/** Numerals as a URL holds them: joined by hyphens, flats as `b`. */
export const numeralsParam = (numerals: readonly Numeral[]): string =>
  numerals.map(numeralText).join('-').replaceAll('♭', 'b')

/**
 * A numeral's chord in a key at a chord size. A 7th written fixes the chord; otherwise the key's own
 * chord on its degree grows as the scale's does (`scaleChordAt`: a 9th only where it is available),
 * and any other grows as its triad says: a major chord to a dominant, a minor one to a minor 7th.
 * A major key counts from the major scale, a minor key from natural minor.
 */
export function numeralChord(numeral: Numeral, key: Key, size: ChordSize): Chord {
  const kind = scaleOf(key)
  const tone = spellScale(key.tonic, kind)[numeral.degree]
  if (!tone) throw new RangeError(`A scale has no degree ${numeral.degree}`)
  const root = plainRoot(
    numeral.shift === 0 ? tone.note : spellAbove(tone.note, { steps: 0, semitones: numeral.shift }),
  )
  if (numeral.seventh !== 'none') {
    const named = NAMED.find(
      ([, triad, seventh]) => triad === numeral.triad && seventh === numeral.seventh,
    )
    if (!named)
      throw new RangeError(`No chord is a ${numeral.triad} triad with a ${numeral.seventh} 7th`)
    return { root, quality: named[0] }
  }
  const own = scaleChords(key.tonic, kind, 3)[numeral.degree]?.quality
  if (numeral.shift === 0 && own === numeral.triad) {
    return scaleChordAt(key.tonic, kind, numeral.degree, SIZE_NOTES[size])
  }
  return { root, quality: size === 'triads' ? numeral.triad : GROWN[size][numeral.triad] }
}

/** A chord as its numeral in a key (Am in C is vi); none for a chord a numeral does not name. */
export function numeralOf(chord: Chord, key: Key): Numeral | null {
  const named = NAMED.find(([quality]) => quality === chord.quality)
  const degree = (letterIndex(chord.root.letter) - letterIndex(key.tonic.letter) + 7) % 7
  const tone = spellScale(key.tonic, scaleOf(key))[degree]
  if (!named || !tone) return null
  const distance = pitchClass(pitchClassOf(chord.root) - tone.pitchClass)
  const shift = distance === 0 ? 0 : distance === 1 ? 1 : distance === 11 ? -1 : null
  return shift === null ? null : { degree, shift, triad: named[1], seventh: named[2] }
}
