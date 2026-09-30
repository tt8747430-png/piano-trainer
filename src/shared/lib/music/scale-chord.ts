import { qualityWithIntervals, type Chord, type ChordQuality } from './chord'
import { seventhName, triadName } from './chord-name'
import { labelled } from './interval'
import type { Key } from './key'
import { noteName, pitchClassOf, type SpelledNote } from './note'
import { pitchClass, type PitchClass } from './pitch'
import { keyScale, spellScale, type ScaleKind } from './scale'
import { availableTensions } from './tensions'
import { toneAbove, type Tone } from './tone'

/** How many notes a chord of a scale stacks: a triad, a 7th, a 9th, an 11th, a 13th. */
export const CHORD_NOTES = [3, 4, 5, 6, 7] as const
export type ChordNotes = (typeof CHORD_NOTES)[number]

/** How big the app plays a chord it works out: a triad, a 7th or a 9th chord. */
export const CHORD_SIZES = ['triads', 'sevenths', 'ninths'] as const
export type ChordSize = (typeof CHORD_SIZES)[number]

/** The notes a chord size stacks. */
export const SIZE_NOTES: Readonly<Record<ChordSize, 3 | 4 | 5>> = {
  triads: 3,
  sevenths: 4,
  ninths: 5,
}

/** The chord size nearest a stack's notes: 9ths for anything larger. */
export const sizeOfNotes = (notes: ChordNotes): ChordSize =>
  notes === 3 ? 'triads' : notes === 4 ? 'sevenths' : 'ninths'

/** A chord of a scale: its notes stacked in thirds from one degree. */
export interface ScaleChord {
  /** 0 the tonic … 6. */
  readonly degree: number
  /** Its Roman numeral in root position, without a figure: `ii`, `vii°`, `III+`, `viiø`. */
  readonly roman: string
  readonly root: SpelledNote
  /** Root, 3rd, 5th, 7th, 9th, 11th, 13th: as many as it stacks. */
  readonly tones: readonly Tone[]
  /** Written after the root: `m7`, `Maj9#11`, `m11♭9♭13`. */
  readonly suffix: string
  /** The table's quality with exactly these tones, where there is one. */
  readonly quality?: ChordQuality
}

/** An extension's semitones when it is natural: the major 9th, the perfect 11th, the major 13th. */
const NATURAL: Readonly<Record<number, number>> = { 9: 14, 11: 17, 13: 21 }
const ALTERATIONS = new Map([
  [-1, '♭'],
  [1, '#'],
])
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

/**
 * A stack's suffix by one rule: its triad, or its 7th chord carrying the highest natural extension,
 * then each altered extension in order (`m7♭9`, `Maj9#11`, `m11♭9♭13`). A 13th chord over a major
 * 3rd leaves its natural 11th out (the Chord builder's `13`), so a stack that keeps it says so:
 * `G13(11)`.
 */
export function stackSuffix(tones: readonly Tone[]): string {
  const semitones = tones.map((tone) => tone.semitones)
  if (tones.length === 3) return triadName(semitones.slice(1, 3)).suffix
  const seventh = seventhName(semitones.slice(1, 4))
  let highest = 7
  const altered: string[] = []
  semitones.slice(4).forEach((above, i) => {
    const extension = 9 + 2 * i
    const alteration = above - (NATURAL[extension] ?? above)
    if (alteration === 0) highest = extension
    else altered.push(`${ALTERATIONS.get(alteration) ?? ''}${extension}`)
  })
  const keptEleventh = highest === 13 && semitones[1] === 4 && semitones[5] === NATURAL[11]
  return `${seventh.lead}${highest}${seventh.trail}${altered.join('')}${keptEleventh ? '(11)' : ''}`
}

/** A stack's numeral mark: its triad's, or from a 7th up its 7th chord's. */
function numeralMark(tones: readonly Tone[]): string {
  const semitones = tones.map((tone) => tone.semitones)
  return tones.length === 3
    ? triadName(semitones.slice(1, 3)).mark
    : seventhName(semitones.slice(1, 4)).mark
}

/**
 * The chords of a seven-note scale, one on each degree, `notes` stacked in thirds: every other note
 * of the scale from the degree up, past the octave from the 9th. None for a scale of fewer notes.
 */
export function scaleChords(root: SpelledNote, kind: ScaleKind, notes: ChordNotes): ScaleChord[] {
  const scale = spellScale(root, kind)
  if (scale.length !== 7) return []
  return scale.map((degreeTone, degree) => {
    const tones = Array.from({ length: notes }, (_, third) => {
      const index = degree + 2 * third
      const above = scale[index % 7]?.semitones ?? 0
      const semitones = above + 12 * Math.floor(index / 7) - degreeTone.semitones
      return toneAbove(degreeTone.note, labelled(2 * third, semitones))
    })
    const numeral = NUMERALS[degree] ?? ''
    const quality = qualityWithIntervals(tones)
    return {
      degree,
      roman: (tones[1]?.semitones === 3 ? numeral.toLowerCase() : numeral) + numeralMark(tones),
      root: degreeTone.note,
      tones,
      suffix: stackSuffix(tones),
      ...(quality ? { quality } : {}),
    }
  })
}

/** A chord of a scale as a symbol, over its bass when that is not the root: `Dm7`, `C/E`. */
export const scaleChordSymbol = (chord: ScaleChord, bass?: SpelledNote): string =>
  noteName(chord.root) + chord.suffix + (bass ? `/${noteName(bass)}` : '')

/** A triad's and a 7th's figured-bass figures by inversion; the tradition has none from a 9th up. */
const FIGURES: Readonly<Partial<Record<ChordNotes, readonly string[]>>> = {
  3: ['', '⁶', '⁶₄'],
  4: ['⁷', '⁶₅', '⁴₃', '⁴₂'],
}

/** What follows a numeral for its chord's inversion: `I⁶`, `ii⁶₅`, `V⁷`; nothing from a 9th up. */
export const romanFigure = (notes: ChordNotes, inversion: number): string =>
  FIGURES[notes]?.[inversion] ?? ''

/** Whether a chord of a scale holds a note, in any octave. */
export const scaleChordHolds = (chord: ScaleChord, pc: PitchClass): boolean =>
  chord.tones.some((tone) => tone.pitchClass === pc)

/** A 9th a chart may add: one that is an available tension over its 7th chord. */
function ninthAvailable(ninth: ScaleChord, seventh: ChordQuality): boolean {
  const above = ninth.tones[4]?.semitones
  return availableTensions(seventh).some((tension) => tension.semitones === above)
}

/**
 * The chord on a degree as a chart plays it: its triad, its 7th, or its 9th where the scale's 9th is
 * an available tension (else its 7th: C major's iii stays Em7). Always one of the table's qualities.
 */
export function scaleChordAt(
  root: SpelledNote,
  kind: ScaleKind,
  degree: number,
  notes: 3 | 4 | 5,
): Chord {
  const base = scaleChords(root, kind, notes === 3 ? 3 : 4)[degree]
  const ninth = notes === 5 ? scaleChords(root, kind, 5)[degree] : undefined
  const quality =
    ninth?.quality && base?.quality && ninthAvailable(ninth, base.quality)
      ? ninth.quality
      : base?.quality
  if (!base || !quality) throw new RangeError(`${kind} has no chord on degree ${degree}`)
  return { root: base.root, quality }
}

/** A chord a key borrows from a parallel scale, its numeral marked by how its root differs from the key's own. */
export interface BorrowedChord extends ScaleChord {
  readonly from: ScaleKind
}

/**
 * The chords a key borrows most (modal mixture): a major key ♭III, iv, ♭VI and ♭VII from its parallel
 * minor; a minor key the Picardy I from major, the Neapolitan ♭II from Phrygian, IV from melodic minor
 * (Dorian's) and V from harmonic minor.
 */
const BORROWED: Readonly<
  Record<'major' | 'minor', readonly { readonly degree: number; readonly from: ScaleKind }[]>
> = {
  major: [
    { degree: 2, from: 'natural' },
    { degree: 3, from: 'natural' },
    { degree: 5, from: 'natural' },
    { degree: 6, from: 'natural' },
  ],
  minor: [
    { degree: 0, from: 'major' },
    { degree: 1, from: 'phrygian' },
    { degree: 3, from: 'melodic' },
    { degree: 4, from: 'harmonic' },
  ],
}
const SHIFT_SIGNS = new Map([
  [1, '#'],
  [11, '♭'],
])

/** A key's borrowed chords of `notes` notes, in degree order. */
export function borrowedChords(key: Key, notes: ChordNotes): BorrowedChord[] {
  const own = spellScale(key.tonic, keyScale(key))
  return BORROWED[key.minor ? 'minor' : 'major'].flatMap(({ degree, from }) => {
    const chord = scaleChords(key.tonic, from, notes)[degree]
    const ownRoot = own[degree]
    if (!chord || !ownRoot) return []
    const shift = pitchClass(pitchClassOf(chord.root) - pitchClassOf(ownRoot.note))
    return [{ ...chord, roman: (SHIFT_SIGNS.get(shift) ?? '') + chord.roman, from }]
  })
}
