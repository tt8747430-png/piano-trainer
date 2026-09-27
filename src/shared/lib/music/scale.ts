import { INTERVALS, type IntervalName, type Interval } from './interval'
import { keyPrefersSharps, keySignature, type Key } from './key'
import { plainSpelling, rootSpelling, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

/** Major and minor; the church modes; pentatonic and blues: the Scale pop-up's groups. */
export const SCALE_FAMILIES = ['keys', 'modes', 'blues'] as const
export type ScaleFamily = (typeof SCALE_FAMILIES)[number]

export const SCALE_KINDS = [
  'major',
  'natural',
  'harmonic',
  'melodic',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'locrian',
  'pent',
  'mpent',
  'majorBlues',
  'blues',
] as const
export type ScaleKind = (typeof SCALE_KINDS)[number]

/** A blue note: of its two spellings, the one with fewer accidentals, the first on a tie. */
interface BlueNote {
  readonly blue: readonly [IntervalName, IntervalName]
}
type ScaleInterval = IntervalName | BlueNote

/** A scale that shares its notes with another: which kind, where its tonic sits in this one, and how. */
export interface Related {
  readonly kind: ScaleKind
  /** Index into this scale's notes. */
  readonly degree: number
  readonly relation: 'relative' | 'parent'
}

interface ScaleEntry {
  readonly family: ScaleFamily
  readonly intervals: readonly ScaleInterval[]
  /** A minor 3rd above the root. */
  readonly minor: boolean
  readonly related: Related
}

const relative = (kind: ScaleKind, degree: number): Related => ({
  kind,
  degree,
  relation: 'relative',
})
/** A mode's parent major scale, its tonic on this degree of the mode. */
const parent = (degree: number): Related => ({ kind: 'major', degree, relation: 'parent' })

const SCALES: Readonly<Record<ScaleKind, ScaleEntry>> = {
  major: {
    family: 'keys',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    minor: false,
    related: relative('natural', 5),
  },
  natural: {
    family: 'keys',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    minor: true,
    related: relative('major', 2),
  },
  harmonic: {
    family: 'keys',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
    minor: true,
    related: relative('major', 2),
  },
  melodic: {
    family: 'keys',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
    minor: true,
    related: relative('major', 2),
  },
  dorian: {
    family: 'modes',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
    minor: true,
    related: parent(6),
  },
  phrygian: {
    family: 'modes',
    intervals: ['r', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    minor: true,
    related: parent(5),
  },
  lydian: {
    family: 'modes',
    intervals: ['r', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
    minor: false,
    related: parent(4),
  },
  mixolydian: {
    family: 'modes',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
    minor: false,
    related: parent(3),
  },
  locrian: {
    family: 'modes',
    intervals: ['r', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],
    minor: true,
    related: parent(1),
  },
  pent: {
    family: 'blues',
    intervals: ['r', 'M2', 'M3', 'P5', 'M6'],
    minor: false,
    related: relative('mpent', 4),
  },
  mpent: {
    family: 'blues',
    intervals: ['r', 'm3', 'P4', 'P5', 'm7'],
    minor: true,
    related: relative('pent', 1),
  },
  majorBlues: {
    family: 'blues',
    intervals: ['r', 'M2', { blue: ['m3', 'A2'] }, 'M3', 'P5', 'M6'],
    minor: false,
    related: relative('blues', 5),
  },
  blues: {
    family: 'blues',
    intervals: ['r', 'm3', 'P4', { blue: ['d5', 'A4'] }, 'P5', 'm7'],
    minor: true,
    related: relative('majorBlues', 1),
  },
}

export const scaleFamily = (kind: ScaleKind): ScaleFamily => SCALES[kind].family

/** A family's kinds, in table order. */
export const scaleKindsIn = (family: ScaleFamily): readonly ScaleKind[] =>
  SCALE_KINDS.filter((kind) => scaleFamily(kind) === family)

/** A minor 3rd above the root: the three minors, Dorian, Phrygian, Locrian, the minor pentatonic and blues. */
export const isMinorScale = (kind: ScaleKind): boolean => SCALES[kind].minor

const plainInterval = (interval: ScaleInterval): IntervalName =>
  typeof interval === 'string' ? interval : interval.blue[0]

/** The scale's intervals above its root, a blue note as its first spelling (♭5, ♭3). */
export const scaleIntervals = (kind: ScaleKind): readonly Interval[] =>
  SCALES[kind].intervals.map((interval) => INTERVALS[plainInterval(interval)])

/** Whether a chord stands on each degree: a scale of seven notes (its numerals run I to VII). */
export const scaleHasChords = (kind: ScaleKind): boolean => scaleIntervals(kind).length === 7

function blueNote(root: SpelledNote, [first, second]: BlueNote['blue']): Tone {
  const a = toneAbove(root, INTERVALS[first])
  const b = toneAbove(root, INTERVALS[second])
  return Math.abs(b.note.accidental) < Math.abs(a.note.accidental) ? b : a
}

/** The scale's notes from the root up, each spelled by letter steps from the root. */
export function spellScale(root: SpelledNote, kind: ScaleKind): Tone[] {
  return SCALES[kind].intervals.map((interval) =>
    typeof interval === 'string'
      ? toneAbove(root, INTERVALS[interval])
      : blueNote(root, interval.blue),
  )
}

/** A scale that shares this one's notes, on its root. */
export interface RelatedScale extends Related {
  readonly root: SpelledNote
}

/**
 * The scale this one shares its notes with, spelled from this one's notes: its relative major or
 * minor (the pentatonics, the blues too), or a mode's parent major.
 */
export function relatedScale(root: SpelledNote, kind: ScaleKind): RelatedScale | null {
  const { related } = SCALES[kind]
  const tone = spellScale(root, kind)[related.degree]
  return tone ? { ...related, root: tone.note } : null
}

/**
 * The key a scale is written in: a major kind's major key, a minor kind's minor key, and a mode its
 * parent major's (D Dorian in C major's signature).
 */
export function scaleKey(root: SpelledNote, kind: ScaleKind): Key {
  const related = relatedScale(root, kind)
  if (related?.relation === 'parent') return { tonic: related.root, minor: false }
  return { tonic: root, minor: isMinorScale(kind) }
}

/**
 * The root a scale on this pitch class is named from: the spelling whose key has fewer sharps or
 * flats (D♯ Phrygian in B major's signature, not E♭ Phrygian in C♭'s), and on a tie the one the
 * major and minor keys already use (minor kinds leaning sharp).
 */
export function scaleRootSpelling(pc: PitchClass, kind: ScaleKind): SpelledNote {
  const accidentals = (root: SpelledNote) => Math.abs(keySignature(scaleKey(root, kind)))
  const sharp = plainSpelling(pc, true)
  const flat = plainSpelling(pc, false)
  const difference = accidentals(sharp) - accidentals(flat)
  if (difference === 0) return rootSpelling(pc, isMinorScale(kind))
  return difference < 0 ? sharp : flat
}

/** The gap between neighbouring notes of a scale: a half step, a whole step, or both (three semitones). */
export type ScaleGap = 'H' | 'W' | 'W+H'
const GAP_BY_SEMITONES: Readonly<Record<number, ScaleGap>> = { 1: 'H', 2: 'W', 3: 'W+H' }

/** The gaps between neighbouring notes up to the octave: W, H, or W+H. */
export function scaleGaps(kind: ScaleKind): ScaleGap[] {
  const semitones = [...scaleIntervals(kind).map((interval) => interval.semitones), 12]
  return semitones.slice(1).map((above, i) => {
    const size = above - (semitones[i] ?? 0)
    const gap = GAP_BY_SEMITONES[size]
    if (!gap) throw new RangeError(`${kind} has a gap of ${size} semitones`)
    return gap
  })
}

/**
 * A pitch class as a key spells it: the note of its scale (a minor key's raised 6th and 7th too),
 * else plainly, sharp in a sharp key and flat otherwise.
 */
export function spellInKey(pc: PitchClass, key: Key): SpelledNote {
  const tones = key.minor
    ? [...spellScale(key.tonic, 'natural'), ...spellScale(key.tonic, 'melodic')]
    : spellScale(key.tonic, 'major')
  return (
    tones.find((tone) => tone.pitchClass === pc)?.note ?? plainSpelling(pc, keyPrefersSharps(key))
  )
}

/** The church modes on the major scale's degrees, in order: Ionian is major, Aeolian natural minor. */
const MODES_OF_MAJOR: readonly ScaleKind[] = [
  'major',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'natural',
  'locrian',
]

/** The scales that share a key's notes: its (relative) major's modes, each on its own root, the key's own left out. */
export function modesOfKey(key: Key): { readonly root: SpelledNote; readonly kind: ScaleKind }[] {
  const own: ScaleKind = key.minor ? 'natural' : 'major'
  const major = key.minor ? relatedScale(key.tonic, 'natural')?.root : key.tonic
  if (!major) return []
  const notes = spellScale(major, 'major')
  return MODES_OF_MAJOR.flatMap((kind, degree) => {
    const root = notes[degree]?.note
    return root && kind !== own ? [{ root, kind }] : []
  })
}

/** A key's relative: the minor on a major key's 6th, the major on a minor key's 3rd. */
export function relativeKey(key: Key): Key {
  const related = relatedScale(key.tonic, key.minor ? 'natural' : 'major')
  if (!related) throw new RangeError('Every major and minor key has a relative')
  return { tonic: related.root, minor: !key.minor }
}
