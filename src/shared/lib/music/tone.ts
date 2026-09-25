import { spellAbove, type LabelledInterval } from './interval'
import { pitchClassOf, type SpelledNote } from './note'
import type { PitchClass } from './pitch'

export const CHORD_ROLES = ['root', '3rd', '5th', '7th', '9th', '11th', '13th'] as const
export type ChordRole = (typeof CHORD_ROLES)[number]

/** A spelled note measured from a root, with its role and degree label: one note of a chord or of a scale. */
export interface Tone {
  readonly note: SpelledNote
  readonly pitchClass: PitchClass
  /** Above the root, past the octave for extensions (a 9th is 14). */
  readonly semitones: number
  readonly role: ChordRole
  /** '1', '♭3', '𝄫7', '#11' */
  readonly degree: string
}

/** A tone's role follows its letter distance from the root: 2 steps is a 3rd, 1 step a 9th. */
const ROLE_BY_STEPS: readonly ChordRole[] = ['root', '9th', '3rd', '11th', '5th', '13th', '7th']

export function toneAbove(root: SpelledNote, interval: LabelledInterval): Tone {
  const spelled = spellAbove(root, interval)
  const role = ROLE_BY_STEPS[interval.steps % 7]
  if (!role) throw new RangeError(`${interval.steps} is not a count of letter steps`)
  return {
    note: spelled,
    pitchClass: pitchClassOf(spelled),
    semitones: interval.semitones,
    role,
    degree: interval.degree,
  }
}
