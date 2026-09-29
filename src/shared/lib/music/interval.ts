import {
  isAccidental,
  letterAt,
  letterIndex,
  naturalPitch,
  pitchClassOf,
  plainSpelling,
  type Letter,
  type SpelledNote,
} from './note'
import { pitchClass, type PitchClass } from './pitch'

/** How far apart two notes are, in letter steps and in semitones: a 3rd is 2 steps. */
export interface Interval {
  readonly steps: number
  readonly semitones: number
}

/** An interval above a root, with the degree it is written as: `♭3`, `#11`. */
export interface LabelledInterval extends Interval {
  readonly degree: string
}

/** The semitones of the major or perfect interval over each letter distance: a 2nd 2, a 4th 5, a 7th 11. */
const PLAIN_SEMITONES = [0, 2, 4, 5, 7, 9, 11]
const DEGREE_SIGNS = new Map([
  [-2, '𝄫'],
  [-1, '♭'],
  [0, ''],
  [1, '#'],
  [2, '𝄪'],
])

/**
 * How an interval above a root is written as a degree: its number from the letter steps, past the
 * octave from 12 semitones on (a 9th, an 11th), and its sign from how far it lies from the major or
 * perfect interval of that number: `♭3`, `#11`, `𝄫7`.
 */
export function degreeLabel(steps: number, semitones: number): string {
  const compound = semitones >= 12
  const plain = (PLAIN_SEMITONES[steps % 7] ?? 0) + (compound ? 12 : 0)
  const sign = DEGREE_SIGNS.get(semitones - plain)
  if (sign === undefined) throw new RangeError(`${semitones} semitones is no ${steps}-step degree`)
  return `${sign}${(steps % 7) + 1 + (compound ? 7 : 0)}`
}

/** An interval of `steps` letters and `semitones`, labelled as its degree. */
export const labelled = (steps: number, semitones: number): LabelledInterval => ({
  steps,
  semitones,
  degree: degreeLabel(steps, semitones),
})

/**
 * The intervals chords and scales are built from, named as musicians abbreviate them: r root,
 * M major, m minor, P perfect, d diminished, A augmented.
 */
export const INTERVALS = {
  r: labelled(0, 0),
  m2: labelled(1, 1),
  M2: labelled(1, 2),
  A2: labelled(1, 3),
  m3: labelled(2, 3),
  M3: labelled(2, 4),
  P4: labelled(3, 5),
  A4: labelled(3, 6),
  d5: labelled(4, 6),
  P5: labelled(4, 7),
  A5: labelled(4, 8),
  m6: labelled(5, 8),
  M6: labelled(5, 9),
  d7: labelled(6, 9),
  m7: labelled(6, 10),
  M7: labelled(6, 11),
  P8: labelled(0, 12),
  m9: labelled(1, 13),
  M9: labelled(1, 14),
  A9: labelled(1, 15),
  P11: labelled(3, 17),
  A11: labelled(3, 18),
  m13: labelled(5, 20),
  M13: labelled(5, 21),
} as const satisfies Record<string, LabelledInterval>
export type IntervalName = keyof typeof INTERVALS

/** A pitch class written on a letter: the accidental between them, or its plain spelling past a double. */
function spelledOn(letter: Letter, pc: PitchClass): SpelledNote {
  const offset = pitchClass(pc - naturalPitch(letter))
  const accidental = offset > 5 ? offset - 12 : offset
  return isAccidental(accidental) ? { letter, accidental } : plainSpelling(pc, accidental > 0)
}

/** The note `interval` above `from`, spelled on the letter the steps reach. */
export const spellAbove = (from: SpelledNote, interval: Interval): SpelledNote =>
  spelledOn(
    letterAt(letterIndex(from.letter) + interval.steps),
    pitchClass(pitchClassOf(from) + interval.semitones),
  )

/** The note `interval` below `from`, spelled on the letter the steps reach down: G's major 3rd below is E♭. */
export const spellBelow = (from: SpelledNote, interval: Interval): SpelledNote =>
  spelledOn(
    letterAt(letterIndex(from.letter) - interval.steps),
    pitchClass(pitchClassOf(from) - interval.semitones),
  )

/** The interval from `from` up to `to` within one octave: steps 0–6, semitones 0–11. */
export function intervalBetween(from: SpelledNote, to: SpelledNote): Interval {
  return {
    steps: (((letterIndex(to.letter) - letterIndex(from.letter)) % 7) + 7) % 7,
    semitones: pitchClass(pitchClassOf(to) - pitchClassOf(from)),
  }
}
