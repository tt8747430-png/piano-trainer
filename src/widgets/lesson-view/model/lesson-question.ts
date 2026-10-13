import type { Lesson, LessonAnswer } from '@/entities/lesson'

import { checkedKeys } from '@/features/trainer'
import { toggled } from '@/shared/lib'
import {
  MIDDLE_C,
  midi,
  noteName,
  parseNoteName,
  pitchClass,
  pitchClassOf,
  type Midi,
} from '@/shared/lib/music'
import { chordSounds, type NoteSound } from '@/shared/lib/schedule'
import type { KeyMark, ShownKeys } from '@/shared/ui'
import { placeExample } from './chord-example'

/** A question's answer on the keys, and whether its notes are played in their order. */
export interface QuestionAnswer extends ShownKeys {
  readonly rising: boolean
}

/**
 * A question's answer on the keys: a chord as the Chords explorer places it; notes in their order from
 * the octave of middle C, each the first key of its name above the last (E up to C is a 6th).
 */
export function questionAnswer(answer: LessonAnswer): QuestionAnswer {
  if ('chord' in answer) return { ...placeExample(answer.chord), rising: false }
  const marks = new Map<Midi, KeyMark>()
  let last: number | null = null
  for (const name of answer.notes) {
    const spelled = parseNoteName(name)
    if (!spelled) throw new RangeError(`A question answers with "${name}", which is not a note`)
    const pc = pitchClassOf(spelled)
    const up = last === null ? 0 : (((pc - last) % 12) + 12) % 12 || 12
    const key: number = last === null ? MIDDLE_C + pc : last + up
    marks.set(midi(key), { tone: 'scale', label: noteName(spelled) })
    last = key
  }
  return { keys: [...marks.keys()], marks, rising: answer.rising === true }
}

/** The keys of an answer heard: a chord's together, notes as a line from the lowest. */
export const answerSounds = (answer: LessonAnswer, keys: readonly Midi[]): NoteSound[] =>
  chordSounds(keys, { arpeggio: 'notes' in answer })

/** Each question of a lesson by its place, `section.block`, with its answer on the keys. */
export const questionAnswers = (lesson: Lesson): ReadonlyMap<string, QuestionAnswer> =>
  new Map(
    lesson.sections.flatMap((section, s) =>
      section.blocks.flatMap((block, b) =>
        block.kind === 'question' ? [[`${s}.${b}`, questionAnswer(block.answer)] as const] : [],
      ),
    ),
  )

const pitchClasses = (keys: readonly Midi[]) => new Set(keys.map((key) => pitchClass(key)))

/**
 * Right: every note of the answer chosen in some octave, and nothing else; a rising answer's notes
 * as its keys lie, from its first note in any octave (D and the 5th above is A above D, not below).
 */
export function isRight(chosen: readonly Midi[], answer: QuestionAnswer): boolean {
  if (answer.rising) {
    const played = chosen.toSorted((a, b) => a - b)
    const [first] = played
    const [from] = answer.keys
    return (
      first !== undefined &&
      from !== undefined &&
      played.length === answer.keys.length &&
      pitchClass(first) === pitchClass(from) &&
      played.every((key, i) => key - first === (answer.keys[i] ?? NaN) - from)
    )
  }
  const played = pitchClasses(chosen)
  const wanted = pitchClasses(answer.keys)
  return played.size === wanted.size && [...wanted].every((pc) => played.has(pc))
}

/** The one open question of a lesson: its keys chosen, and where it stands. */
export type QuestionState = {
  readonly id: string
  readonly chosen: readonly Midi[]
  readonly stage: 'choosing' | 'right' | 'wrong' | 'answer'
} | null

type QuestionEvent =
  | { readonly type: 'open'; readonly id: string }
  | { readonly type: 'toggle'; readonly key: Midi }
  | { readonly type: 'check'; readonly right: boolean }
  | { readonly type: 'reveal' }
  | { readonly type: 'retry' }
  | { readonly type: 'close' }

/** One question open at a time; a key chosen after a verdict takes the learner back to choosing. */
export function questionReducer(state: QuestionState, event: QuestionEvent): QuestionState {
  if (event.type === 'open') return { id: event.id, chosen: [], stage: 'choosing' }
  if (event.type === 'close' || !state) return null
  switch (event.type) {
    case 'toggle':
      if (state.stage === 'answer') return state
      return {
        ...state,
        stage: 'choosing',
        chosen: toggled(state.chosen, event.key),
      }
    case 'check':
      return { ...state, stage: event.right ? 'right' : 'wrong' }
    case 'reveal':
      return { ...state, stage: 'answer' }
    case 'retry':
      return { ...state, chosen: [], stage: 'choosing' }
  }
}

/** What the lesson's keyboard shows for its open question. */
export interface QuestionKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly selected?: ReadonlySet<Midi>
  readonly wrong?: ReadonlySet<Midi>
  readonly outlined?: ReadonlySet<Midi>
}

/** Choosing: the chosen keys. After Check: the verdict on them. The answer shown: the answer. */
export function questionKeys(state: NonNullable<QuestionState>, answer: ShownKeys): QuestionKeys {
  switch (state.stage) {
    case 'choosing':
      return { keys: state.chosen, marks: new Map(), selected: new Set(state.chosen) }
    case 'right':
    case 'wrong': {
      const checked = checkedKeys(state.chosen, answer)
      return { keys: [...state.chosen, ...checked.outlined], ...checked }
    }
    case 'answer':
      return { keys: answer.keys, marks: answer.marks }
  }
}
