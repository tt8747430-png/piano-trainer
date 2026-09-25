import { describe, expect, it } from 'vitest'
import { midi, note, noteName, pitchClass, pitchClassOf, type SkillId } from '@/shared/lib/music'
import {
  INITIAL_QUIZ,
  answerOf,
  createQuestion,
  isFinished,
  quizReducer,
  type QuizConfig,
  type QuizEvent,
  type QuizState,
} from './quiz-machine'

/** A random source that plays back fixed values, round and round. */
const scripted =
  (...values: number[]) =>
  () => {
    const value = values.shift() ?? 0
    values.push(value)
    return value
  }

const config = (
  skills: SkillId[],
  extra: Partial<QuizConfig['scope']> = {},
  chordMode: QuizConfig['chordMode'] = 'build-chord',
): QuizConfig => ({
  chordMode,
  scope: { skills, ...extra },
})

const run = (state: QuizState, ...events: QuizEvent[]) => events.reduce(quizReducer, state)
const keys = (...values: number[]): QuizEvent[] =>
  values.map((value) => ({ type: 'toggleKey', midi: midi(value) }))

describe('createQuestion', () => {
  it('asks an ordered scope’s skills in order, round and round', () => {
    const scope = config(['chord:m7', 'scale:blues', 'chord:maj'], { ordered: true })
    const skills = [0, 1, 2, 3].map(
      (index) => createQuestion(scope, { index, random: scripted(0.5) }).skill,
    )
    expect(skills).toEqual(['chord:m7', 'scale:blues', 'chord:maj', 'chord:m7'])
  })

  it('draws from the scope’s skills and roots', () => {
    const scope = config(['chord:m7', 'chord:d7'], { roots: [pitchClass(2), pitchClass(7)] })
    const random = scripted(0.1, 0.9, 0.7, 0.2, 0.4, 0.6)
    for (let index = 0; index < 12; index++) {
      const question = createQuestion(scope, { index, random })
      expect(['chord:m7', 'chord:d7']).toContain(question.skill)
      expect([2, 7]).toContain(pitchClassOf(question.root))
    }
  })

  it('builds a chord from its root, spelled as the quality leans', () => {
    const question = createQuestion(config(['chord:m7'], { roots: [pitchClass(1)] }), {
      index: 0,
      random: scripted(0),
    })
    expect(question).toMatchObject({ mode: 'build-chord', quality: 'm7', symbol: 'C#m7' })
    expect(question.mode === 'build-chord' && question.tones.map((t) => noteName(t.note))).toEqual([
      'C#',
      'E',
      'G#',
      'B',
    ])
  })

  it('builds a scale whatever the chord mode', () => {
    const question = createQuestion(
      config(['scale:harmonic'], { roots: [pitchClass(8)] }, 'name-chord'),
      {
        index: 0,
        random: scripted(0),
      },
    )
    expect(question.mode).toBe('build-scale')
    expect(question.mode === 'build-scale' && question.notes.map((t) => noteName(t.note))).toEqual([
      'G#',
      'A#',
      'B',
      'C#',
      'D#',
      'E',
      'F𝄪',
    ])
  })

  it('draws again rather than repeat a question, and repeats when it must', () => {
    const scope = config(['chord:maj'], { roots: [pitchClass(0), pitchClass(5)] })
    const first = createQuestion(scope, { index: 0, random: scripted(0) })
    const second = createQuestion(scope, { index: 1, random: scripted(0, 0.9), previous: first })
    expect(pitchClassOf(second.root)).toBe(5)
    const only = config(['chord:maj'], { roots: [pitchClass(0)] })
    const again = createQuestion(only, { index: 1, random: scripted(0), previous: first })
    expect(again.root).toEqual(note('C'))
  })

  it('offers four different chords on the same root for Name chord, the answer among them', () => {
    const scope = config(
      ['chord:m7', 'chord:d7', 'chord:hd'],
      { roots: [pitchClass(9)] },
      'name-chord',
    )
    const question = createQuestion(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord question')
    expect(question.options).toHaveLength(4)
    expect(new Set(question.options).size).toBe(4)
    expect(question.options).toContain(question.symbol)
    expect(
      question.options.every((option) => option.startsWith('A') && !option.startsWith('A#')),
    ).toBe(true)
    const others = question.options.filter((option) => option !== question.symbol)
    const family = ['Am7', 'A7', 'Am7♭5'].filter((symbol) => symbol !== question.symbol)
    for (const symbol of family) expect(others).toContain(symbol)
  })
})

describe('quizReducer', () => {
  const cMajor = createQuestion(config(['chord:maj'], { roots: [pitchClass(0)] }), {
    index: 0,
    random: scripted(0),
  })
  const asked = run(INITIAL_QUIZ, { type: 'ask', question: cMajor })

  it('counts each question asked and clears the last answer', () => {
    const answered = run(asked, ...keys(60), { type: 'check' })
    const next = run(answered, { type: 'ask', question: cMajor })
    expect(next).toMatchObject({ asked: 2, selected: [], result: null })
  })

  it('takes a right chord in any octave', () => {
    const answered = run(asked, ...keys(48, 76, 67), { type: 'check' })
    expect(answered.result).toEqual({ kind: 'keys', correct: true, missing: [], extra: [] })
    expect(answered.correct).toBe(1)
  })

  it('names what is missing and what is extra', () => {
    const answered = run(asked, ...keys(60, 63, 67, 70), { type: 'check' })
    expect(answered.result).toEqual({
      kind: 'keys',
      correct: false,
      missing: [note('E')],
      extra: [3, 10],
    })
    expect(answered.correct).toBe(0)
  })

  it('lets a key be taken back, and all keys cleared', () => {
    expect(run(asked, ...keys(60, 62, 62)).selected).toEqual([60])
    expect(run(asked, ...keys(60, 64), { type: 'clear' }).selected).toEqual([])
  })

  it('ignores keys and checks once answered', () => {
    const answered = run(asked, ...keys(60, 64, 67), { type: 'check' })
    expect(run(answered, ...keys(61), { type: 'clear' }, { type: 'check' })).toBe(answered)
  })

  it('judges a Name chord answer', () => {
    const question = createQuestion(
      config(['chord:m7'], { roots: [pitchClass(9)] }, 'name-chord'),
      {
        index: 0,
        random: scripted(0.2),
      },
    )
    const naming = run(INITIAL_QUIZ, { type: 'ask', question })
    const right = run(naming, { type: 'choose', symbol: 'Am7' })
    expect(right.result).toEqual({ kind: 'choice', correct: true, chosen: 'Am7' })
    const wrong = run(naming, { type: 'choose', symbol: 'A7' })
    expect(wrong.result).toEqual({ kind: 'choice', correct: false, chosen: 'A7' })
    expect(run(wrong, { type: 'choose', symbol: 'Am7' })).toBe(wrong)
    expect(run(naming, ...keys(60), { type: 'check' })).toBe(naming)
  })

  it('ignores everything before the first question', () => {
    expect(run(INITIAL_QUIZ, ...keys(60), { type: 'check' }, { type: 'choose', symbol: 'C' })).toBe(
      INITIAL_QUIZ,
    )
  })
})

describe('answers and the end of a quiz', () => {
  const question = createQuestion(config(['chord:maj'], { roots: [pitchClass(0)] }), {
    index: 0,
    random: scripted(0),
  })

  it('gives the answer to record once there is one', () => {
    const asked = run(INITIAL_QUIZ, { type: 'ask', question })
    expect(answerOf(asked)).toBeNull()
    expect(answerOf(run(asked, ...keys(60, 64, 67), { type: 'check' }))).toEqual({
      skill: 'chord:maj',
      correct: true,
    })
  })

  it('ends a scope of set length once its last question is answered', () => {
    const scope = { skills: ['chord:maj'] as SkillId[], length: 2 }
    const once = run(INITIAL_QUIZ, { type: 'ask', question }, { type: 'check' })
    const twice = run(once, { type: 'ask', question })
    expect(isFinished(once, scope)).toBe(false)
    expect(isFinished(twice, scope)).toBe(false)
    expect(isFinished(run(twice, { type: 'check' }), scope)).toBe(true)
    expect(isFinished(run(twice, { type: 'check' }), { skills: scope.skills })).toBe(false)
  })
})
