import type { Interval } from './interval'
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

/** Each degree label and the interval above the root it names. */
const DEGREES = {
  '1': { steps: 0, semitones: 0 },
  '2': { steps: 1, semitones: 2 },
  '♭3': { steps: 2, semitones: 3 },
  '3': { steps: 2, semitones: 4 },
  '4': { steps: 3, semitones: 5 },
  '#4': { steps: 3, semitones: 6 },
  '♭5': { steps: 4, semitones: 6 },
  '5': { steps: 4, semitones: 7 },
  '♭6': { steps: 5, semitones: 8 },
  '6': { steps: 5, semitones: 9 },
  '♭7': { steps: 6, semitones: 10 },
  '7': { steps: 6, semitones: 11 },
} as const satisfies Record<string, Interval>

/** A degree, or the blues' blue note: ♭5, or #4 where that needs fewer accidentals. */
type ScaleDegree = keyof typeof DEGREES | 'blue'

interface ScaleEntry {
  readonly degrees: readonly ScaleDegree[]
  readonly minor: boolean
}

const SCALES: Readonly<Record<ScaleKind, ScaleEntry>> = {
  major: { degrees: ['1', '2', '3', '4', '5', '6', '7'], minor: false },
  natural: { degrees: ['1', '2', '♭3', '4', '5', '♭6', '♭7'], minor: true },
  harmonic: { degrees: ['1', '2', '♭3', '4', '5', '♭6', '7'], minor: true },
  melodic: { degrees: ['1', '2', '♭3', '4', '5', '6', '7'], minor: true },
  pent: { degrees: ['1', '2', '3', '5', '6'], minor: false },
  mpent: { degrees: ['1', '♭3', '4', '5', '♭7'], minor: true },
  blues: { degrees: ['1', '♭3', '4', 'blue', '5', '♭7'], minor: true },
}

export const isMinorScale = (kind: ScaleKind): boolean => SCALES[kind].minor

/** The root a scale on this pitch class is named from: minor kinds, the blues too, lean sharp. */
export const scaleRootSpelling = (pc: PitchClass, kind: ScaleKind): SpelledNote =>
  rootSpelling(pc, isMinorScale(kind))

function blueNote(root: SpelledNote): Tone {
  const flatFive = toneAbove(root, DEGREES['♭5'], '♭5')
  const sharpFour = toneAbove(root, DEGREES['#4'], '#4')
  const fewer = Math.abs(sharpFour.note.accidental) < Math.abs(flatFive.note.accidental)
  return fewer ? sharpFour : flatFive
}

/** The scale's notes from the root up, each spelled by letter steps from the root. */
export function spellScale(root: SpelledNote, kind: ScaleKind): Tone[] {
  return SCALES[kind].degrees.map((degree) =>
    degree === 'blue' ? blueNote(root) : toneAbove(root, DEGREES[degree], degree),
  )
}
