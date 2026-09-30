import type { QuizAnswer } from '@/entities/progress'
import {
  pitchClass,
  type ChordQuality,
  type Midi,
  type PitchClass,
  type ScaleKind,
  type SkillId,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'

export type QuizMode = 'build-chord' | 'name-chord' | 'build-scale'

/**
 * Which skills a quiz asks about: the open-ended quiz, a piece's check, a step's check and My gaps
 * are the same machine with different scopes. `ordered` asks the skills in list order (My gaps).
 */
export interface QuizScope {
  readonly skills: readonly SkillId[]
  readonly roots?: readonly PitchClass[]
  readonly length?: number
  readonly ordered?: boolean
}

export interface QuizConfig {
  readonly chordMode: 'build-chord' | 'name-chord'
  readonly scope: QuizScope
}

export interface ChordQuestion {
  readonly skill: SkillId
  readonly root: SpelledNote
  readonly quality: ChordQuality
  readonly symbol: string
  readonly tones: readonly Tone[]
}

export type Question =
  | ({ readonly mode: 'build-chord' } & ChordQuestion)
  | ({ readonly mode: 'name-chord'; readonly options: readonly string[] } & ChordQuestion)
  | {
      readonly mode: 'build-scale'
      readonly skill: SkillId
      readonly root: SpelledNote
      readonly kind: ScaleKind
      readonly notes: readonly Tone[]
    }

export type QuizResult =
  | {
      readonly kind: 'keys'
      readonly correct: boolean
      readonly missing: readonly SpelledNote[]
      readonly extra: readonly PitchClass[]
    }
  | { readonly kind: 'choice'; readonly correct: boolean; readonly chosen: string }

export interface QuizState {
  readonly question: Question
  readonly selected: readonly Midi[]
  /** The answer to the question asked, once given. */
  readonly result: QuizResult | null
  readonly asked: number
  readonly correct: number
}

export type QuizEvent =
  | { readonly type: 'ask'; readonly question: Question }
  | { readonly type: 'toggleKey'; readonly midi: Midi }
  | { readonly type: 'clear' }
  | { readonly type: 'check' }
  | { readonly type: 'choose'; readonly symbol: string }

/** A quiz asking its first question. */
export const startQuiz = (question: Question): QuizState => ({
  question,
  selected: [],
  result: null,
  asked: 1,
  correct: 0,
})

/** What a built chord or scale must hold: its notes, any octave. */
export const tonesOf = (question: Question): readonly Tone[] =>
  question.mode === 'build-scale' ? question.notes : question.tones

function checkKeys(question: Question, selected: readonly Midi[]): QuizResult {
  const played = new Set(selected.map((key) => pitchClass(key)))
  const target = tonesOf(question)
  const wanted = new Set(target.map((tone) => tone.pitchClass))
  const missing = target.filter((tone) => !played.has(tone.pitchClass)).map((tone) => tone.note)
  const extra = [...played].filter((pc) => !wanted.has(pc)).sort((a, b) => a - b)
  return { kind: 'keys', correct: missing.length === 0 && extra.length === 0, missing, extra }
}

const answered = (state: QuizState, result: QuizResult): QuizState => ({
  ...state,
  result,
  correct: state.correct + (result.correct ? 1 : 0),
})

/** Build chord, Name chord and Build scale: once a question is answered, input waits for the next. */
export function quizReducer(state: QuizState, event: QuizEvent): QuizState {
  if (event.type === 'ask') {
    return {
      ...state,
      question: event.question,
      selected: [],
      result: null,
      asked: state.asked + 1,
    }
  }
  const { question } = state
  if (state.result) return state
  const building = question.mode !== 'name-chord'
  switch (event.type) {
    case 'toggleKey':
      if (!building) return state
      return {
        ...state,
        selected: state.selected.includes(event.midi)
          ? state.selected.filter((key) => key !== event.midi)
          : [...state.selected, event.midi],
      }
    case 'clear':
      return building && state.selected.length > 0 ? { ...state, selected: [] } : state
    case 'check':
      return building ? answered(state, checkKeys(question, state.selected)) : state
    case 'choose':
      return building
        ? state
        : answered(state, {
            kind: 'choice',
            correct: event.symbol === question.symbol,
            chosen: event.symbol,
          })
  }
}

/** The answer to record as evidence, once the question is answered. */
export function answerOf(state: QuizState): QuizAnswer | null {
  return state.result ? { skill: state.question.skill, correct: state.result.correct } : null
}

/** A scope of set length is over once its last question is answered. */
export const isFinished = (state: QuizState, scope: QuizScope): boolean =>
  scope.length !== undefined && state.asked >= scope.length && state.result !== null
