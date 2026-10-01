import type { QuizAnswer } from '@/entities/progress'
import {
  pitchClass,
  type ChordQuality,
  type ReferenceInterval,
  type Key,
  type Midi,
  type PitchClass,
  type ScaleKind,
  type SkillId,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import type { IntervalWay } from '@/shared/lib/schedule'

/** A chord to build or name: its symbol (over its bass in an inversion) and its tones from the root. */
export interface ChordQuestion {
  /** The skill an answer is evidence on; none for a chord a level names by its place in a key. */
  readonly skill?: SkillId
  readonly root: SpelledNote
  readonly quality: ChordQuality
  readonly symbol: string
  readonly tones: readonly Tone[]
  /** The tone that must be lowest (its inversion), or null: any voicing will do. */
  readonly inversion: number | null
}

/**
 * One round of a trainer. Build chord, Build scale, Reading notes and The degrees of a key are
 * answered on the keys; the rest by choosing one of their `options`.
 */
export type Question =
  | ({ readonly mode: 'build-chord' } & ChordQuestion)
  | ({ readonly mode: 'name-chord'; readonly options: readonly string[] } & ChordQuestion)
  | {
      readonly mode: 'build-scale'
      readonly skill?: SkillId
      readonly root: SpelledNote
      readonly kind: ScaleKind
      readonly notes: readonly Tone[]
    }
  | {
      readonly mode: 'name-interval'
      readonly interval: ReferenceInterval
      readonly low: Midi
      readonly high: Midi
      readonly way: IntervalWay
      readonly options: readonly ReferenceInterval[]
    }
  | {
      readonly mode: 'name-quality'
      readonly root: SpelledNote
      readonly keys: readonly Midi[]
      readonly quality: ChordQuality
      readonly arpeggio: boolean
      readonly options: readonly ChordQuality[]
    }
  | {
      readonly mode: 'name-scale'
      readonly root: SpelledNote
      readonly keys: readonly Midi[]
      readonly kind: ScaleKind
      readonly options: readonly ScaleKind[]
    }
  | {
      readonly mode: 'read-note'
      readonly key: Midi
      readonly spelled: SpelledNote
      readonly clef: StaffId
    }
  | {
      readonly mode: 'key-signature'
      readonly key: Key
      /** How many sharps or flats a named key has, or which key a signature on the staff is. */
      readonly ask: 'count' | 'name'
      readonly options: readonly string[]
      readonly answer: string
    }
  | {
      readonly mode: 'key-degrees'
      readonly key: Key
      /** The key's degrees, I to VII. */
      readonly notes: readonly Tone[]
    }
  | {
      readonly mode: 'chord-role'
      readonly key: Key
      /** The chord's numeral in the key, as the options write it. */
      readonly numeral: string
      /** The tonic's keys, then the chord's: what is heard. */
      readonly tonicKeys: readonly Midi[]
      readonly chordKeys: readonly Midi[]
      readonly options: readonly string[]
    }

export type Mode = Question['mode']
export type ChoiceQuestion = Extract<Question, { readonly options: readonly unknown[] }>

/** Build chord and Build scale: keys are chosen, then checked. */
export const choosesKeys = (
  question: Question,
): question is Extract<Question, { mode: 'build-chord' | 'build-scale' }> =>
  question.mode === 'build-chord' || question.mode === 'build-scale'

/** Reading notes and The degrees of a key: each key pressed is part of the answer at once. */
export const pressesKeys = (
  question: Question,
): question is Extract<Question, { mode: 'read-note' | 'key-degrees' }> =>
  question.mode === 'read-note' || question.mode === 'key-degrees'

export const isChoice = (question: Question): question is ChoiceQuestion => 'options' in question

/** The option a choice round is answered by. */
export function choiceAnswer(question: ChoiceQuestion): string {
  switch (question.mode) {
    case 'name-chord':
      return question.symbol
    case 'name-interval':
      return question.interval
    case 'name-quality':
      return question.quality
    case 'name-scale':
      return question.kind
    case 'key-signature':
      return question.answer
    case 'chord-role':
      return question.numeral
  }
}

export type RoundResult =
  | {
      readonly kind: 'keys'
      readonly correct: boolean
      readonly missing: readonly SpelledNote[]
      readonly extra: readonly PitchClass[]
      /** The lowest key chosen is not the tone the inversion puts there. */
      readonly wrongBass: boolean
    }
  | { readonly kind: 'choice'; readonly correct: boolean; readonly chosen: string }
  | { readonly kind: 'note'; readonly correct: boolean; readonly played: Midi }
  | { readonly kind: 'degrees'; readonly correct: boolean; readonly played: readonly Midi[] }

export interface RoundState {
  readonly question: Question
  /** The keys chosen or pressed so far. */
  readonly selected: readonly Midi[]
  /** The answer, once given. */
  readonly result: RoundResult | null
}

export type RoundEvent =
  | { readonly type: 'ask'; readonly question: Question }
  | { readonly type: 'toggleKey'; readonly midi: Midi }
  | { readonly type: 'pressKey'; readonly midi: Midi }
  | { readonly type: 'clear' }
  | { readonly type: 'check' }
  | { readonly type: 'choose'; readonly option: string }

/** A round asked, nothing answered yet. */
export const startRound = (question: Question): RoundState => ({
  question,
  selected: [],
  result: null,
})

/** What a built chord or scale must hold: its notes, any octave. */
export const tonesOf = (question: Extract<Question, { mode: 'build-chord' | 'build-scale' }>) =>
  question.mode === 'build-scale' ? question.notes : question.tones

function checkKeys(
  question: Extract<Question, { mode: 'build-chord' | 'build-scale' }>,
  selected: readonly Midi[],
): RoundResult {
  const played = new Set(selected.map((key) => pitchClass(key)))
  const target = tonesOf(question)
  const wanted = new Set(target.map((tone) => tone.pitchClass))
  const missing = target.filter((tone) => !played.has(tone.pitchClass)).map((tone) => tone.note)
  const extra = [...played].filter((pc) => !wanted.has(pc)).sort((a, b) => a - b)
  const bass =
    question.mode === 'build-chord' && question.inversion !== null
      ? question.tones[question.inversion]
      : undefined
  const lowest = selected.length > 0 ? Math.min(...selected) : null
  const wrongBass = bass !== undefined && lowest !== null && pitchClass(lowest) !== bass.pitchClass
  return {
    kind: 'keys',
    correct: missing.length === 0 && extra.length === 0 && !wrongBass,
    missing,
    extra,
    wrongBass,
  }
}

/** The next key of a key's degrees: right while each press is the next degree, done at the seventh. */
function pressDegree(state: RoundState, notes: readonly Tone[], key: Midi): RoundState {
  const played = [...state.selected, key]
  const expected = notes[state.selected.length]
  if (!expected || pitchClass(key) !== expected.pitchClass)
    return { ...state, selected: played, result: { kind: 'degrees', correct: false, played } }
  if (played.length < notes.length) return { ...state, selected: played }
  return { ...state, selected: played, result: { kind: 'degrees', correct: true, played } }
}

/** One round: once answered, input waits for the next. */
export function roundReducer(state: RoundState, event: RoundEvent): RoundState {
  if (event.type === 'ask') return startRound(event.question)
  const { question } = state
  if (state.result) return state
  switch (event.type) {
    case 'toggleKey':
      if (!choosesKeys(question)) return state
      return {
        ...state,
        selected: state.selected.includes(event.midi)
          ? state.selected.filter((key) => key !== event.midi)
          : [...state.selected, event.midi],
      }
    case 'pressKey':
      if (question.mode === 'read-note') {
        const correct = event.midi === question.key
        return {
          ...state,
          selected: [event.midi],
          result: { kind: 'note', correct, played: event.midi },
        }
      }
      return question.mode === 'key-degrees'
        ? pressDegree(state, question.notes, event.midi)
        : state
    case 'clear':
      return choosesKeys(question) && state.selected.length > 0 ? { ...state, selected: [] } : state
    case 'check':
      return choosesKeys(question)
        ? { ...state, result: checkKeys(question, state.selected) }
        : state
    case 'choose':
      return isChoice(question)
        ? {
            ...state,
            result: {
              kind: 'choice',
              correct: event.option === choiceAnswer(question),
              chosen: event.option,
            },
          }
        : state
  }
}

/** The answer to record as evidence, once given on a round that rates a skill. */
export function answerOf(state: RoundState): QuizAnswer | null {
  const { question, result } = state
  const skill = 'skill' in question ? question.skill : undefined
  return result && skill ? { skill, correct: result.correct } : null
}
