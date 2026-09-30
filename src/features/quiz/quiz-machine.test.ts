import { describe, expect, it } from 'vitest'
import { midi, note, pitchClass, type SkillId } from '@/shared/lib/music'
import { createQuestion } from './quiz-draw'
import {
  answerOf,
  isFinished,
  quizReducer,
  startQuiz,
  type QuizEvent,
  type QuizState,
} from './quiz-machine'
import { config, scripted } from './testing/quiz-configs'

const run = (state: QuizState, ...events: QuizEvent[]) => events.reduce(quizReducer, state)
const keys = (...values: number[]): QuizEvent[] =>
  values.map((value) => ({ type: 'toggleKey', midi: midi(value) }))

describe('quizReducer', () => {
  const cMajor = createQuestion(config(['chord:maj'], { roots: [pitchClass(0)] }), {
    index: 0,
    random: scripted(0),
  })
  const asked = startQuiz(cMajor)

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
    const naming = startQuiz(question)
    const right = run(naming, { type: 'choose', symbol: 'Am7' })
    expect(right.result).toEqual({ kind: 'choice', correct: true, chosen: 'Am7' })
    const wrong = run(naming, { type: 'choose', symbol: 'A7' })
    expect(wrong.result).toEqual({ kind: 'choice', correct: false, chosen: 'A7' })
    expect(run(wrong, { type: 'choose', symbol: 'Am7' })).toBe(wrong)
    expect(run(naming, ...keys(60), { type: 'check' })).toBe(naming)
  })
})

describe('answers and the end of a quiz', () => {
  const question = createQuestion(config(['chord:maj'], { roots: [pitchClass(0)] }), {
    index: 0,
    random: scripted(0),
  })

  it('gives the answer to record once there is one', () => {
    const asked = startQuiz(question)
    expect(answerOf(asked)).toBeNull()
    expect(answerOf(run(asked, ...keys(60, 64, 67), { type: 'check' }))).toEqual({
      skill: 'chord:maj',
      correct: true,
    })
  })

  it('ends a scope of set length once its last question is answered', () => {
    const scope = { skills: ['chord:maj'] as SkillId[], length: 2 }
    const once = run(startQuiz(question), { type: 'check' })
    const twice = run(once, { type: 'ask', question })
    expect(isFinished(once, scope)).toBe(false)
    expect(isFinished(twice, scope)).toBe(false)
    expect(isFinished(run(twice, { type: 'check' }), scope)).toBe(true)
    expect(isFinished(run(twice, { type: 'check' }), { skills: scope.skills })).toBe(false)
  })
})
