import type { QuizAnswer } from '@/entities/lesson'
import type { ShownKeys } from '@/features/play-example'
import {
  MIDDLE_C,
  midi,
  noteName,
  parseNoteName,
  pitchClass,
  pitchClassOf,
  type Midi,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'
import { placeExample } from './chord-example'

/** A quiz's answer on the keys: a chord as the Chords reference places it, notes from middle C up. */
export function quizAnswer(answer: QuizAnswer): ShownKeys {
  if ('chord' in answer) return placeExample(answer.chord)
  const marks = new Map<Midi, KeyMark>()
  for (const name of answer.notes) {
    const spelled = parseNoteName(name)
    if (!spelled) throw new RangeError(`A quiz answers with "${name}", which is not a note`)
    marks.set(midi(MIDDLE_C + pitchClassOf(spelled)), { tone: 'scale', label: noteName(spelled) })
  }
  return { keys: [...marks.keys()].sort((a, b) => a - b), marks }
}

const pitchClasses = (keys: readonly Midi[]) => new Set(keys.map((key) => pitchClass(key)))

/** Right: every note of the answer chosen in some octave, and nothing else. */
export function isRight(chosen: readonly Midi[], answer: ShownKeys): boolean {
  const played = pitchClasses(chosen)
  const wanted = pitchClasses(answer.keys)
  return played.size === wanted.size && [...wanted].every((pc) => played.has(pc))
}

/** After Check: each right key marked as the answer marks its note, the extras wrong, the missing ringed. */
export function checkedKeys(
  chosen: readonly Midi[],
  answer: ShownKeys,
): { marks: Map<Midi, KeyMark>; wrong: Set<Midi>; outlined: Set<Midi> } {
  const byNote = new Map(answer.keys.map((key) => [pitchClass(key), answer.marks.get(key)]))
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  for (const key of chosen) {
    const mark = byNote.get(pitchClass(key))
    if (mark) marks.set(key, mark)
    else wrong.add(key)
  }
  const played = pitchClasses(chosen)
  return {
    marks,
    wrong,
    outlined: new Set(answer.keys.filter((key) => !played.has(pitchClass(key)))),
  }
}

/** The one open quiz of a lesson: its keys chosen, and where it stands. */
export type QuizState = {
  readonly id: string
  readonly chosen: readonly Midi[]
  readonly stage: 'choosing' | 'right' | 'wrong' | 'answer'
} | null

export type QuizEvent =
  | { readonly type: 'open'; readonly id: string }
  | { readonly type: 'toggle'; readonly key: Midi }
  | { readonly type: 'check'; readonly right: boolean }
  | { readonly type: 'reveal' }
  | { readonly type: 'retry' }
  | { readonly type: 'close' }

/** One quiz open at a time; a key chosen after a verdict takes the learner back to choosing. */
export function quizReducer(state: QuizState, event: QuizEvent): QuizState {
  if (event.type === 'open') return { id: event.id, chosen: [], stage: 'choosing' }
  if (event.type === 'close' || !state) return null
  switch (event.type) {
    case 'toggle':
      if (state.stage === 'answer') return state
      return {
        ...state,
        stage: 'choosing',
        chosen: state.chosen.includes(event.key)
          ? state.chosen.filter((key) => key !== event.key)
          : [...state.chosen, event.key],
      }
    case 'check':
      return { ...state, stage: event.right ? 'right' : 'wrong' }
    case 'reveal':
      return { ...state, stage: 'answer' }
    case 'retry':
      return { ...state, chosen: [], stage: 'choosing' }
  }
}

/** What the lesson's keyboard shows for its open quiz. */
export interface QuizKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly selected?: ReadonlySet<Midi>
  readonly wrong?: ReadonlySet<Midi>
  readonly outlined?: ReadonlySet<Midi>
}

/** Choosing: the chosen keys. After Check: the verdict on them. The answer shown: the answer. */
export function quizKeys(state: NonNullable<QuizState>, answer: ShownKeys): QuizKeys {
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
