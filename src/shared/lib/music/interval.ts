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
