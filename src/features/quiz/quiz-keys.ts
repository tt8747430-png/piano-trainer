import {
  keyboardRange,
  MIDDLE_C,
  midi,
  pitchClass,
  placeChord,
  placeScale,
  type KeyRange,
  type Midi,
  type Tone,
} from '@/shared/lib/music'
import { chordSounds, type NoteSound } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { Question } from './quiz-machine'

/** Middle C to the E above the next C: room to build most chords and scales, any octave counting. */
export const QUIZ_RANGE: KeyRange = { from: MIDDLE_C, to: midi(76) }

const tonesOf = (question: Question): readonly Tone[] =>
  question.mode === 'build-scale' ? question.notes : question.tones

/** The question's answer on the keyboard: a chord placed from middle C, a scale up from its root. */
export function targetKeys(question: Question): Midi[] {
  const placed =
    question.mode === 'build-scale'
      ? placeScale(question.root, question.kind)
      : placeChord(question.root, question.quality, { inversion: 0, bothHands: false }).rh
  return placed.map((tone) => tone.midi)
}

/**
 * The quiz range, grown to hold the question's answer, so a wide chord shows whole and the keys
 * outlined after Check are on the keyboard.
 */
export const quizKeyboardRange = (question: Question | null): KeyRange =>
  question ? keyboardRange(targetKeys(question), QUIZ_RANGE) : QUIZ_RANGE

/** The answer, sounded: a chord struck, a scale rolled upwards. */
export const questionSounds = (question: Question): NoteSound[] =>
  chordSounds(targetKeys(question), { arpeggio: question.mode === 'build-scale' })

/** After Check: the right keys by role, the missing tones outlined where the answer has them, extras wrong. */
export function answerKeys(
  question: Question,
  selected: readonly Midi[],
): { marks: Map<Midi, KeyMark>; outlined: Set<Midi>; wrong: Set<Midi> } {
  const tones = tonesOf(question)
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  for (const key of selected) {
    const tone = tones.find((t) => t.pitchClass === pitchClass(key))
    if (tone) marks.set(key, { tone: tone.role, label: tone.degree })
    else wrong.add(key)
  }
  const played = new Set(selected.map((key) => pitchClass(key)))
  const outlined = new Set(targetKeys(question).filter((key) => !played.has(pitchClass(key))))
  return { marks, outlined, wrong }
}
