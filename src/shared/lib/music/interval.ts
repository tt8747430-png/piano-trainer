import {
  letterAt,
  letterIndex,
  naturalPitch,
  pitchClassOf,
  plainSpelling,
  type Accidental,
  type SpelledNote,
} from './note'
import { pitchClass } from './pitch'

/** How far apart two notes are, in letter steps and in semitones: a 3rd is 2 steps. */
export interface Interval {
  readonly steps: number
  readonly semitones: number
}

/** An interval above a root, with the degree it is written as: `♭3`, `#11`. */
export interface LabelledInterval extends Interval {
  readonly degree: string
}

const above = (steps: number, semitones: number, degree: string): LabelledInterval => ({
  steps,
  semitones,
  degree,
})

/**
 * The intervals chords and scales are built from, named as musicians abbreviate them: r root,
 * M major, m minor, P perfect, d diminished, A augmented.
 */
export const INTERVALS = {
  r: above(0, 0, '1'),
  M2: above(1, 2, '2'),
  m3: above(2, 3, '♭3'),
  M3: above(2, 4, '3'),
  P4: above(3, 5, '4'),
  A4: above(3, 6, '#4'),
  d5: above(4, 6, '♭5'),
  P5: above(4, 7, '5'),
  A5: above(4, 8, '#5'),
  m6: above(5, 8, '♭6'),
  M6: above(5, 9, '6'),
  d7: above(6, 9, '𝄫7'),
  m7: above(6, 10, '♭7'),
  M7: above(6, 11, '7'),
  m9: above(1, 13, '♭9'),
  M9: above(1, 14, '9'),
  A9: above(1, 15, '#9'),
  P11: above(3, 17, '11'),
  A11: above(3, 18, '#11'),
  m13: above(5, 20, '♭13'),
  M13: above(5, 21, '13'),
} as const satisfies Record<string, LabelledInterval>
export type IntervalName = keyof typeof INTERVALS

/** The note `interval` above `from`, spelled on the letter the steps reach. */
export function spellAbove(from: SpelledNote, interval: Interval): SpelledNote {
  const letter = letterAt(letterIndex(from.letter) + interval.steps)
  const pc = pitchClass(pitchClassOf(from) + interval.semitones)
  const offset = pitchClass(pc - naturalPitch(letter))
  const accidental = offset > 5 ? offset - 12 : offset
  if (Math.abs(accidental) > 2) return plainSpelling(pc, accidental > 0)
  return { letter, accidental: accidental as Accidental }
}

/** The interval from `from` up to `to` within one octave: steps 0–6, semitones 0–11. */
export function intervalBetween(from: SpelledNote, to: SpelledNote): Interval {
  return {
    steps: (((letterIndex(to.letter) - letterIndex(from.letter)) % 7) + 7) % 7,
    semitones: pitchClass(pitchClassOf(to) - pitchClassOf(from)),
  }
}
