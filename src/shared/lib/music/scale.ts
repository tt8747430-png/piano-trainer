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
