import { INTERVALS, type IntervalName, type Interval } from './interval'
import { rootSpelling, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

export const SCALE_KINDS = [
  'major',
  'natural',
  'harmonic',
  'melodic',
  'pent',
  'mpent',
  'blues',
] as const
export type ScaleKind = (typeof SCALE_KINDS)[number]

/** A scale's intervals, or the blues' blue note: ♭5, or #4 where that needs fewer accidentals. */
type ScaleInterval = IntervalName | 'blue'

interface ScaleEntry {
  readonly intervals: readonly ScaleInterval[]
  readonly minor: boolean
}

const SCALES: Readonly<Record<ScaleKind, ScaleEntry>> = {
  major: { intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'], minor: false },
  natural: { intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'], minor: true },
  harmonic: { intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'], minor: true },
  melodic: { intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'], minor: true },
  pent: { intervals: ['r', 'M2', 'M3', 'P5', 'M6'], minor: false },
  mpent: { intervals: ['r', 'm3', 'P4', 'P5', 'm7'], minor: true },
  blues: { intervals: ['r', 'm3', 'P4', 'blue', 'P5', 'm7'], minor: true },
}

export const isMinorScale = (kind: ScaleKind): boolean => SCALES[kind].minor

/** The root a scale on this pitch class is named from: minor kinds, the blues too, lean sharp. */
export const scaleRootSpelling = (pc: PitchClass, kind: ScaleKind): SpelledNote =>
  rootSpelling(pc, isMinorScale(kind))

function blueNote(root: SpelledNote): Tone {
  const flatFive = toneAbove(root, INTERVALS.d5)
  const sharpFour = toneAbove(root, INTERVALS.A4)
  const fewer = Math.abs(sharpFour.note.accidental) < Math.abs(flatFive.note.accidental)
  return fewer ? sharpFour : flatFive
}

/** The scale's intervals above its root, the blues' blue note as ♭5. */
export const scaleIntervals = (kind: ScaleKind): readonly Interval[] =>
  SCALES[kind].intervals.map((name) => INTERVALS[name === 'blue' ? 'd5' : name])

/** The scale's notes from the root up, each spelled by letter steps from the root. */
export function spellScale(root: SpelledNote, kind: ScaleKind): Tone[] {
  return SCALES[kind].intervals.map((name) =>
    name === 'blue' ? blueNote(root) : toneAbove(root, INTERVALS[name]),
  )
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

/** Each scale's relative: which kind, on which of its degrees (index into its notes). */
const RELATIVES: Partial<Record<ScaleKind, { readonly kind: ScaleKind; readonly degree: number }>> =
  {
    major: { kind: 'natural', degree: 5 },
    natural: { kind: 'major', degree: 2 },
    harmonic: { kind: 'major', degree: 2 },
    melodic: { kind: 'major', degree: 2 },
    pent: { kind: 'mpent', degree: 4 },
    mpent: { kind: 'pent', degree: 1 },
  }

/** The relative major or minor, spelled from the scale's own notes; none for the blues. */
export function relativeScale(
  root: SpelledNote,
  kind: ScaleKind,
): { root: SpelledNote; kind: ScaleKind } | null {
  const relative = RELATIVES[kind]
  const tone = relative ? spellScale(root, kind)[relative.degree] : undefined
  return relative && tone ? { root: tone.note, kind: relative.kind } : null
}
