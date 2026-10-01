import {
  keyboardRange,
  MIDDLE_C,
  midi,
  pitchClass,
  placeChord,
  placeScale,
  spellChord,
  type KeyRange,
  type Midi,
  type PlacedTone,
} from '@/shared/lib/music'
import { chordSounds, type NoteSound } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { Question } from './quiz-machine'

/** Middle C to the E above the next C: room to build most chords and scales, any octave counting. */
export const QUIZ_RANGE: KeyRange = { from: MIDDLE_C, to: midi(76) }

/** The question's answer placed: a chord from middle C, a scale up from its root. */
const targetPlaced = (question: Question): readonly PlacedTone[] =>
  question.mode === 'build-scale'
    ? placeScale(question.root, question.kind)
    : placeChord(spellChord(question.root, question.quality), { inversion: 0, bothHands: false }).rh

/** The question's answer on the keyboard. */
export const targetKeys = (question: Question): Midi[] =>
  targetPlaced(question).map((tone) => tone.midi)

/**
 * The quiz range, grown to hold the question's answer, so a wide chord shows whole and the keys
 * outlined after Check are on the keyboard.
 */
export const quizKeyboardRange = (question: Question): KeyRange =>
  keyboardRange(targetKeys(question), QUIZ_RANGE)

/** The answer, sounded: a chord struck, a scale rolled upwards. */
export const questionSounds = (question: Question): NoteSound[] =>
  chordSounds(targetKeys(question), { arpeggio: question.mode === 'build-scale' })

/** An answer on the keys: its keys, each marked. */
interface AnswerKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}

/** A quiz's verdict on the keys chosen, after Check. */
export interface CheckedKeys {
  readonly marks: Map<Midi, KeyMark>
  readonly wrong: Set<Midi>
  readonly outlined: Set<Midi>
}

/**
 * After Check: each chosen key of one of the answer's notes marked as the answer marks that note, the
 * other keys wrong, and the answer's keys whose notes were not chosen, in any octave, ringed.
 */
export function checkedKeys(chosen: readonly Midi[], answer: AnswerKeys): CheckedKeys {
  const byNote = new Map(answer.keys.map((key) => [pitchClass(key), answer.marks.get(key)]))
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  for (const key of chosen) {
    const mark = byNote.get(pitchClass(key))
    if (mark) marks.set(key, mark)
    else wrong.add(key)
  }
  const played = new Set(chosen.map((key) => pitchClass(key)))
  return {
    marks,
    wrong,
    outlined: new Set(answer.keys.filter((key) => !played.has(pitchClass(key)))),
  }
}

/** After Check on a build question: the keys chosen against its answer, each tone by role. */
export function answerKeys(question: Question, selected: readonly Midi[]): CheckedKeys {
  const placed = targetPlaced(question)
  return checkedKeys(selected, {
    keys: placed.map((key) => key.midi),
    marks: new Map(
      placed.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }]),
    ),
  })
}
