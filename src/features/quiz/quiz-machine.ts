import type { QuizAnswer } from '@/entities/progress'
import {
  CHORD_QUALITIES,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  pitchClass,
  scaleRootSpelling,
  skillOf,
  spellChord,
  spellScale,
  type ChordQuality,
  type Midi,
  type PitchClass,
  type ScaleKind,
  type SkillId,
  type SpelledNote,
  type Tone,
  sameNote,
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

interface ChordQuestion {
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
  readonly question: Question | null
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

export const INITIAL_QUIZ: QuizState = {
  question: null,
  selected: [],
  result: null,
  asked: 0,
  correct: 0,
}

const ALL_ROOTS = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
/** A question equal to the last one is drawn again at most this many times. */
const DRAWS = 8
const OPTIONS = 4

function itemAt<T>(items: readonly T[], index: number): T {
  const item = items[index]
  if (item === undefined) throw new RangeError(`No item ${index} of ${items.length}`)
  return item
}

const pick = <T>(items: readonly T[], random: () => number): T =>
  itemAt(items, Math.min(items.length - 1, Math.floor(random() * items.length)))

/** In an order drawn from `random`. */
const shuffled = <T>(items: readonly T[], random: () => number): T[] =>
  items
    .map((item) => ({ item, key: random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item)

/** The answer and three other chords on the same root: the scope's own family first, then any. */
function nameOptions(
  question: ChordQuestion,
  scope: QuizScope,
  random: () => number,
): readonly string[] {
  const family = chordFamily(question.quality)
  const inScope = new Set(
    scope.skills.flatMap((id) => {
      const skill = skillOf(id)
      return skill.kind === 'chord' && skill.quality !== question.quality ? [skill.quality] : []
    }),
  )
  const sameFamily = shuffled(
    [...inScope].filter((quality) => chordFamily(quality) === family),
    random,
  )
  const others = shuffled(
    CHORD_QUALITIES.filter(
      (quality) => quality !== question.quality && !sameFamily.includes(quality),
    ),
    random,
  )
  const wrong = [...sameFamily, ...others]
    .slice(0, OPTIONS - 1)
    .map((quality) => chordSymbol({ root: question.root, quality }))
  return shuffled([...wrong, question.symbol], random)
}

function draw(config: QuizConfig, index: number, random: () => number): Question {
  const { scope } = config
  const skill = scope.ordered
    ? itemAt(scope.skills, index % scope.skills.length)
    : pick(scope.skills, random)
  const pc = pick(scope.roots?.length ? scope.roots : ALL_ROOTS, random)
  const target = skillOf(skill)
  if (target.kind === 'scale') {
    const root = scaleRootSpelling(pc, target.scale)
    return {
      mode: 'build-scale',
      skill,
      root,
      kind: target.scale,
      notes: spellScale(root, target.scale),
    }
  }
  const root = chordRootSpelling(pc, target.quality)
  const chord: ChordQuestion = {
    skill,
    root,
    quality: target.quality,
    symbol: chordSymbol({ root, quality: target.quality }),
    tones: spellChord(root, target.quality),
  }
  return config.chordMode === 'name-chord'
    ? { mode: 'name-chord', ...chord, options: nameOptions(chord, scope, random) }
    : { mode: 'build-chord', ...chord }
}

const sameQuestion = (a: Question, b: Question | null | undefined): boolean =>
  !!b && a.skill === b.skill && sameNote(a.root, b.root)

/** The next question of a quiz; a repeat of the last one is drawn again, up to 8 times. */
export function createQuestion(
  config: QuizConfig,
  context: { index: number; random: () => number; previous?: Question | null },
): Question {
  let question = draw(config, context.index, context.random)
  for (let draws = 1; draws < DRAWS && sameQuestion(question, context.previous); draws++) {
    question = draw(config, context.index, context.random)
  }
  return question
}

/** What a built chord or scale must hold: its notes, any octave. */
const targetOf = (question: Question): readonly Tone[] =>
  question.mode === 'build-scale' ? question.notes : question.tones

function checkKeys(question: Question, selected: readonly Midi[]): QuizResult {
  const played = new Set(selected.map((key) => pitchClass(key)))
  const target = targetOf(question)
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
  if (!question || state.result) return state
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
  return state.question && state.result
    ? { skill: state.question.skill, correct: state.result.correct }
    : null
}

/** A scope of set length is over once its last question is answered. */
export const isFinished = (state: QuizState, scope: QuizScope): boolean =>
  scope.length !== undefined && state.asked >= scope.length && state.result !== null
