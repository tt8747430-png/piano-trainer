import { describe, expect, it } from 'vitest'
import {
  selectAnswers,
  selectIsLearned,
  selectLastPractised,
  selectLearned,
  selectPractised,
  selectQuizStats,
  selectRating,
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
