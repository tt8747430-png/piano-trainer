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

/** A question's answer on the keys, and whether its notes are played as they lie, rising or falling. */
export interface QuestionAnswer extends ShownKeys {
  readonly inOrder: boolean
}

/** Where notes in no order stay: from the C below middle C to the C two octaves above it. */
const LOWEST_NEAR = MIDDLE_C - 12
const HIGHEST_NEAR = MIDDLE_C + 24

/** The next note's key: the first of its name above or below the last, or the nearer of the two. */
function nextKey(last: number, pc: number, order: 'rising' | 'falling' | null): number {
  const up = last + ((((pc - last) % 12) + 12) % 12 || 12)
  const down = up - 12
  if (order === 'rising') return up
  if (order === 'falling') return down
  const [near, far] = up - last <= last - down ? [up, down] : [down, up]
  return near >= LOWEST_NEAR && near <= HIGHEST_NEAR ? near : far
}

/**
 * A question's answer on the keys: a chord as the Chords explorer places it; notes in their order
 * from the octave of middle C, each the first key of its name above the last when rising (E up to C
 * is a 6th), below it when falling, else the nearer, kept near middle C.
 */
export function questionAnswer(answer: LessonAnswer): QuestionAnswer {
  if ('chord' in answer) return { ...placeExample(answer.chord), inOrder: false }
  const order = answer.rising ? 'rising' : answer.falling ? 'falling' : null
  const marks = new Map<Midi, KeyMark>()
  let last: number | null = null
  for (const name of answer.notes) {
    const spelled = parseNoteName(name)
    if (!spelled) throw new RangeError(`A question answers with "${name}", which is not a note`)
    const pc = pitchClassOf(spelled)
    const key: number = last === null ? MIDDLE_C + pc : nextKey(last, pc, order)
    marks.set(midi(key), { tone: 'scale', label: noteName(spelled) })
    last = key
  }
  return { keys: [...marks.keys()], marks, inOrder: order !== null }
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

const lowFirst = (keys: readonly Midi[]) => keys.toSorted((a, b) => a - b)

/**
 * Right: every note of the answer chosen in some octave, and nothing else; an answer in order's notes
 * as its keys lie, from its lowest note in any octave (D and the 5th above is A above D, not below).
 */
export function isRight(chosen: readonly Midi[], answer: QuestionAnswer): boolean {
  if (answer.inOrder) {
    const played = lowFirst(chosen)
    const wanted = lowFirst(answer.keys)
    const [first] = played
    const [from] = wanted
    return (
      first !== undefined &&
      from !== undefined &&
      played.length === wanted.length &&
      pitchClass(first) === pitchClass(from) &&
      played.every((key, i) => key - first === (wanted[i] ?? NaN) - from)
    )
  }
  const played = pitchClasses(chosen)
  const wanted = pitchClasses(answer.keys)
  return played.size === wanted.size && [...wanted].every((pc) => played.has(pc))
}

/**
 * How many notes are chosen, and how many the answer has: a chord's or a set's notes each once in
 * any octave, an answer in order's every key.
 */
export function chosenOf(
  chosen: readonly Midi[],
  answer: QuestionAnswer,
): { readonly chosen: number; readonly total: number } {
  return answer.inOrder
    ? { chosen: chosen.length, total: answer.keys.length }
    : { chosen: pitchClasses(chosen).size, total: pitchClasses(answer.keys).size }
}

/** The one open question of a lesson: its keys chosen, and where it stands. */
export type QuestionState = {
  readonly id: string
  readonly chosen: readonly Midi[]
  readonly stage: 'choosing' | 'right' | 'wrong' | 'answer'
} | null

type QuestionEvent =
  | { readonly type: 'open'; readonly id: string }
  | { readonly type: 'toggle'; readonly key: Midi; readonly answer: QuestionAnswer }
  | { readonly type: 'reveal' }
  | { readonly type: 'retry' }
  | { readonly type: 'close' }

/**
 * One question open at a time. A key chosen or let go chooses again, and the keys are judged as soon
 * as they are as many notes as the answer's: no Check to press.
 */
export function questionReducer(state: QuestionState, event: QuestionEvent): QuestionState {
  if (event.type === 'open') return { id: event.id, chosen: [], stage: 'choosing' }
  if (event.type === 'close' || !state) return null
  switch (event.type) {
    case 'toggle': {
      if (state.stage === 'answer') return state
      const chosen = toggled(state.chosen, event.key)
      const { chosen: count, total } = chosenOf(chosen, event.answer)
      const stage = count < total ? 'choosing' : isRight(chosen, event.answer) ? 'right' : 'wrong'
      return { ...state, chosen, stage }
    }
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
}

/**
 * Choosing: the chosen keys. Judged: the verdict on them, a wrong key marked and the missing ones
 * left for the learner to find. The answer shown: the answer.
 */
export function questionKeys(state: NonNullable<QuestionState>, answer: ShownKeys): QuestionKeys {
  switch (state.stage) {
    case 'choosing':
      return { keys: state.chosen, marks: new Map(), selected: new Set(state.chosen) }
    case 'right':
    case 'wrong': {
      const { marks, wrong } = checkedKeys(state.chosen, answer)
      return { keys: state.chosen, marks, wrong }
    }
    case 'answer':
      return { keys: answer.keys, marks: answer.marks }
  }
}
