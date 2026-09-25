import { describe, expect, it } from 'vitest'
import { pathSteps } from '@/entities/path'
import {
  selectAnswers,
  selectIsLearned,
  selectLastPractised,
  selectLearned,
  selectPractised,
  selectQuizStats,
  selectRating,
  selectSuggestedStep,
} from './selectors'
import { EMPTY_PROGRESS, type ProgressState } from './types'

const state: ProgressState = {
  learned: { 'piece:bz5': '2026-09-20T10:00:00.000Z' },
  practised: {
    bz5: '2026-09-20T10:00:00.000Z',
    ode: '2026-09-24T10:00:00.000Z',
    hgta: '2026-09-22T10:00:00.000Z',
  },
  answers: { 'chord:m7': [{ correct: true, at: '2026-09-24T10:00:00.000Z' }] },
  quiz: { correct: 1, total: 1, streak: 1, best: 1 },
}

describe('progress selectors', () => {
  it('return saved fields as they are', () => {
    expect(selectLearned(state)).toBe(state.learned)
    expect(selectPractised(state)).toBe(state.practised)
    expect(selectQuizStats(state)).toBe(state.quiz)
  })

  it('tell whether a step is learned', () => {
    expect(selectIsLearned('piece:bz5')(state)).toBe(true)
    expect(selectIsLearned('chords:sev')(state)).toBe(false)
  })

  it('rate a skill from its evidence', () => {
    expect(selectRating('chord:m7')(state)).toBe('gap')
    expect(selectRating('chord:maj')(state)).toBe('unknown')
  })

  it('find the piece practised last', () => {
    expect(selectLastPractised(state)).toBe('ode')
    expect(selectLastPractised(EMPTY_PROGRESS)).toBeNull()
  })

  it('give an unanswered skill the same empty evidence every time', () => {
    expect(selectAnswers('chord:maj')(state)).toEqual([])
    expect(selectAnswers('chord:maj')(state)).toBe(selectAnswers('scale:blues')(EMPTY_PROGRESS))
    expect(selectAnswers('chord:m7')(state)).toBe(state.answers['chord:m7'])
  })
})

describe('selectSuggestedStep', () => {
  const steps = pathSteps()
  const first = steps[0]
  const bz5 = steps.find((s) => s.id === 'piece:bz5')

  it('suggests the first step on a first run', () => {
    expect(selectSuggestedStep(EMPTY_PROGRESS)).toBe(first)
  })

  it('suggests the piece practised last while it is not learned', () => {
    const state = {
      ...EMPTY_PROGRESS,
      practised: { ex3: '2026-09-01T10:00:00Z', bz5: '2026-09-02T10:00:00Z' },
    }
    expect(selectSuggestedStep(state)).toBe(bz5)
  })

  it('moves on to the first unlearned step once that piece is learned', () => {
    const state = {
      ...EMPTY_PROGRESS,
      practised: { bz5: '2026-09-02T10:00:00Z' },
      learned: { 'piece:bz5': '2026-09-03T10:00:00Z' },
    }
    expect(selectSuggestedStep(state)).toBe(first)
  })

  it('passes over a practised piece the path no longer has', () => {
    const state = {
      ...EMPTY_PROGRESS,
      practised: { bz5: '2026-09-02T10:00:00Z', gone: '2026-09-05T10:00:00Z' },
    }
    expect(selectSuggestedStep(state)).toBe(bz5)
  })

  it('suggests nothing when every step is learned', () => {
    const learned = Object.fromEntries(steps.map((s) => [s.id, '2026-09-01T10:00:00Z']))
    expect(selectSuggestedStep({ ...EMPTY_PROGRESS, learned })).toBeNull()
  })
})
