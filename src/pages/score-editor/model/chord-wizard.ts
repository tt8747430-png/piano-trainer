import {
  note,
  spellChord,
  type Chord,
  type ChordQuality,
  type Letter,
  type SpelledNote,
} from '@/shared/lib/music'

/** The accidentals the wizard writes a root with: ♭, none, ♯. */
export const WIZARD_ACCIDENTALS = [-1, 0, 1] as const
export type WizardAccidental = (typeof WIZARD_ACCIDENTALS)[number]

/** A chord as Flat's wizard builds it: a root's letter and accidental, a quality, an inversion. */
export interface WizardChoice {
  readonly letter: Letter
  readonly accidental: WizardAccidental
  readonly quality: ChordQuality
  /** 0 the root in the bass; 1 the next chord tone up, and so on. */
  readonly inversion: number
}

/** The most inversions offered, Flat's Fourth. */
const MOST_INVERSIONS = 4

/** The chord tones a chord may stand over, its root left out: its inversions' basses, in order. */
export const bassesOf = (choice: Omit<WizardChoice, 'inversion'>): readonly SpelledNote[] =>
  spellChord(note(choice.letter, choice.accidental), choice.quality)
    .slice(1, MOST_INVERSIONS + 1)
    .map((tone) => tone.note)

/** The chord the choices build: an inversion stands over its chord tone, spelled as the chord spells it. */
export function wizardChord(choice: WizardChoice): Chord {
  const root = note(choice.letter, choice.accidental)
  const bass = choice.inversion > 0 ? bassesOf(choice)[choice.inversion - 1] : undefined
  return bass ? { root, quality: choice.quality, bass } : { root, quality: choice.quality }
}

const isWizardAccidental = (value: number): value is WizardAccidental =>
  (WIZARD_ACCIDENTALS as readonly number[]).includes(value)

/** The choices that build a chord typed (an inversion where its bass is a chord tone), else C major. */
export function wizardOf(chord: Chord | null): WizardChoice {
  if (!chord || !isWizardAccidental(chord.root.accidental))
    return { letter: 'C', accidental: 0, quality: 'maj', inversion: 0 }
  const choice = {
    letter: chord.root.letter,
    accidental: chord.root.accidental,
    quality: chord.quality,
  }
  const bass = chord.bass
  const at = bass
    ? bassesOf(choice).findIndex(
        (each) => each.letter === bass.letter && each.accidental === bass.accidental,
      )
    : -1
  return { ...choice, inversion: at + 1 }
}
