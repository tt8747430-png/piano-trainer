import { INTERVALS, type IntervalName, type Interval } from './interval'
import { keyPrefersSharps, keySignature, type Key } from './key'
import { degreeNames, type DegreeName } from './key-relations'
import { note, plainSpelling, rootSpelling, sameNote, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

/**
 * Major and minor; the church modes; pentatonic and blues; the symmetric scales (whole-tone, the two
 * diminished, chromatic); and the others (harmonic major, Hungarian minor, the bebop scales): the
 * Scale pop-up's groups.
 */
export const SCALE_FAMILIES = ['keys', 'modes', 'blues', 'symmetric', 'other'] as const
type ScaleFamily = (typeof SCALE_FAMILIES)[number]

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
  'wholeTone',
  'halfWhole',
  'wholeHalf',
  'chromatic',
  'harmonicMajor',
  'hungarian',
  'bebopMajor',
  'bebopDominant',
] as const
export type ScaleKind = (typeof SCALE_KINDS)[number]

/** A blue note: of its two spellings, the one with fewer accidentals, the first on a tie. */
interface BlueNote {
  readonly blue: readonly [IntervalName, IntervalName]
}
type ScaleInterval = IntervalName | BlueNote

/** A scale that shares its notes with another: which kind, where its tonic sits in this one, and how. */
interface Related {
  readonly kind: ScaleKind
  /** Index into this scale's notes. */
  readonly degree: number
  readonly relation: 'relative' | 'parent'
}

interface ScaleEntry {
  readonly family: ScaleFamily
  readonly intervals: readonly ScaleInterval[]
  /** A minor 3rd above the root (and no major 3rd). */
  readonly minor: boolean
  /** The scale it shares its notes with, where there is one. */
  readonly related?: Related
  /**
   * The major key it is written in, where not its root's own: no signature (a symmetric scale, its
   * accidentals written as they fall), or the major on one of its degrees (a bebop dominant in its
   * Mixolydian's).
   */
  readonly writtenIn?: 'plain' | number
  /** A seven-note scale whose stacked 3rds are no chords (Hungarian minor's D F♯ A♭). */
  readonly noChords?: true
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
  wholeTone: {
    family: 'symmetric',
    // Its 6th note as the 7th it sounds as (B♭ over C), as jazz writes it: no letter is left out twice.
    intervals: ['r', 'M2', 'M3', 'A4', 'A5', 'm7'],
    minor: false,
    writtenIn: 'plain',
  },
  halfWhole: {
    family: 'symmetric',
    intervals: ['r', 'm2', 'm3', 'M3', 'A4', 'P5', 'M6', 'm7'],
    minor: false,
    writtenIn: 'plain',
  },
  wholeHalf: {
    family: 'symmetric',
    intervals: ['r', 'M2', 'm3', 'P4', 'd5', 'm6', 'M6', 'M7'],
    minor: true,
    writtenIn: 'plain',
  },
  // The harmonic chromatic scale: each letter twice but the tonic's and the dominant's.
  chromatic: {
    family: 'symmetric',
    intervals: ['r', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],
    minor: false,
    writtenIn: 'plain',
  },
  harmonicMajor: {
    family: 'other',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'm6', 'M7'],
    minor: false,
  },
  hungarian: {
    family: 'other',
    intervals: ['r', 'M2', 'm3', 'A4', 'P5', 'm6', 'M7'],
    minor: true,
    noChords: true,
  },
  bebopMajor: {
    family: 'other',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'A5', 'M6', 'M7'],
    minor: false,
  },
  bebopDominant: {
    family: 'other',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'],
    minor: false,
    writtenIn: 3,
  },
}

const scaleFamily = (kind: ScaleKind): ScaleFamily => SCALES[kind].family

/** A family's kinds, in table order. */
export const scaleKindsIn = (family: ScaleFamily): readonly ScaleKind[] =>
  SCALE_KINDS.filter((kind) => scaleFamily(kind) === family)

/** A minor 3rd above the root: the three minors, Dorian, Phrygian, Locrian, the minor pentatonic and blues. */
export const isMinorScale = (kind: ScaleKind): boolean => SCALES[kind].minor

/** The key a scale is the scale of: major, minor for the three minors; null for a mode or a blues scale. */
export const keyMode = (kind: ScaleKind): 'major' | 'minor' | null =>
  scaleFamily(kind) === 'keys' ? (isMinorScale(kind) ? 'minor' : 'major') : null

const plainInterval = (interval: ScaleInterval): IntervalName =>
  typeof interval === 'string' ? interval : interval.blue[0]

/** The scale's intervals above its root, a blue note as its first spelling (♭5, ♭3). */
export const scaleIntervals = (kind: ScaleKind): readonly Interval[] =>
  SCALES[kind].intervals.map((interval) => INTERVALS[plainInterval(interval)])

/** A church mode: fingered, and written, as its parent major. */
export const isMode = (kind: ScaleKind): boolean => SCALES[kind].related?.relation === 'parent'

/** A scale of seven notes: one a degree, as a mode's or a key's. */
export const isHeptatonic = (kind: ScaleKind): boolean => scaleIntervals(kind).length === 7

/**
 * Whether a chord stands on each degree: a scale of seven notes (its numerals run I to VII) whose
 * stacked 3rds make chords.
 */
export const scaleHasChords = (kind: ScaleKind): boolean =>
  isHeptatonic(kind) && SCALES[kind].noChords !== true

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
interface RelatedScale extends Related {
  readonly root: SpelledNote
}

/**
 * The scale this one shares its notes with, spelled from this one's notes: its relative major or
 * minor (the pentatonics, the blues too), or a mode's parent major.
 */
export function relatedScale(root: SpelledNote, kind: ScaleKind): RelatedScale | null {
  const { related } = SCALES[kind]
  const tone = related && spellScale(root, kind)[related.degree]
  return related && tone ? { ...related, root: tone.note } : null
}

/**
 * The key a scale is written in: a major kind's major key, a minor kind's minor key, a mode its
 * parent major's (D Dorian in C major's signature), a bebop dominant its Mixolydian's, and a
 * symmetric scale no signature at all.
 */
export function scaleKey(root: SpelledNote, kind: ScaleKind): Key {
  const { writtenIn } = SCALES[kind]
  if (writtenIn === 'plain') return { tonic: note('C'), minor: false }
  const major = writtenIn === undefined ? undefined : spellScale(root, kind)[writtenIn]
  if (major) return { tonic: major.note, minor: false }
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

/**
 * Each degree's name in a seven-note scale, a key's names (`degreeNames`) for any mode: the 7th a
 * leading tone a half step under the tonic, a subtonic a whole step under it (natural minor's,
 * Mixolydian's). None for a scale of more or fewer notes.
 */
export function scaleDegreeNames(kind: ScaleKind): readonly DegreeName[] | null {
  if (!isHeptatonic(kind)) return null
  return degreeNames(scaleIntervals(kind)[6]?.semitones !== 11)
}

/** The gap between neighbouring notes of a scale: a half step, a whole step, or both (three semitones). */
type ScaleGap = 'H' | 'W' | 'W+H'
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

/** A scale coming back down: melodic minor comes down as natural minor, as it is taught; any other as it went up. */
export const kindComingDown = (kind: ScaleKind): ScaleKind =>
  kind === 'melodic' ? 'natural' : kind

/** A key's own scale: a major key's major, a minor key's natural minor. */
export const keyScale = (key: Key): ScaleKind => (key.minor ? 'natural' : 'major')

/** The notes a key's chords are made of: its scale's, and in a minor key its raised 6th and 7th too. */
export const keyTones = (key: Key): Tone[] =>
  key.minor
    ? [...spellScale(key.tonic, 'natural'), ...spellScale(key.tonic, 'melodic')]
    : spellScale(key.tonic, 'major')

/** Whether every tone is one of the key's notes, spelled as the key spells it: A♭ is not A minor's G♯. */
export function tonesInKey(tones: readonly Tone[], key: Key): boolean {
  const notes = keyTones(key)
  return tones.every((tone) => notes.some((note) => sameNote(note.note, tone.note)))
}

/**
 * A pitch class as a key spells it: the note of its scale (a minor key's raised 6th and 7th too),
 * else plainly, sharp in a sharp key and flat otherwise.
 */
export function spellInKey(pc: PitchClass, key: Key): SpelledNote {
  return (
    keyTones(key).find((tone) => tone.pitchClass === pc)?.note ??
    plainSpelling(pc, keyPrefersSharps(key))
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
  const own = keyScale(key)
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
  const related = relatedScale(key.tonic, keyScale(key))
  if (!related) throw new RangeError('Every major and minor key has a relative')
  return { tonic: related.root, minor: !key.minor }
}
