import { describe, expect, it } from 'vitest'
import {
  byLastOpened,
  selectAnswers,
  selectHolds,
  selectIsLearned,
  selectLearned,
  selectPractised,
  selectTempo,
  selectTrainerRecord,
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
  trainers: { 'name-chord:3': { runs: 2, last: 80, best: 90, bestStreak: 6 } },
  days: [],
  lessons: { 'bz5:chord:C': '2026-09-24T10:00:00.000Z' },
  holds: { 'bz5:chord:G': 2 },
  read: { 'lesson:triads': [0] },
  tempos: { 'hanon:5': 84 },
}

describe('selectTempo', () => {
  it('reads an exercise’s last tempo, none where none is kept', () => {
    expect(selectTempo('hanon:5')(state)).toBe(84)
    expect(selectTempo('scale')(state)).toBeUndefined()
  })
})

describe('progress selectors', () => {
  it('return saved fields as they are', () => {
    expect(selectLearned(state)).toBe(state.learned)
    expect(selectPractised(state)).toBe(state.practised)
  })

  it('return a trainer level’s record, or none before its first run', () => {
    expect(selectTrainerRecord('name-chord:3')(state)).toEqual({
      runs: 2,
      last: 80,
      best: 90,
      bestStreak: 6,
    })
    expect(selectTrainerRecord('name-chord:4')(state)).toBeUndefined()
  })

  it('tell whether a step is learned', () => {
    expect(selectIsLearned('piece:bz5')(state)).toBe(true)
    expect(selectIsLearned('chords:sev')(state)).toBe(false)
  })

  it('give an unanswered skill the same empty evidence every time', () => {
    expect(selectAnswers('chord:maj')(state)).toEqual([])
    expect(selectAnswers('chord:maj')(state)).toBe(selectAnswers('scale:blues')(EMPTY_PROGRESS))
    expect(selectAnswers('chord:m7')(state)).toBe(state.answers['chord:m7'])
  })
})

describe('byLastOpened', () => {
  it('lists the pieces opened, latest first', () => {
    const practised = {
      bz5: '2026-10-09T10:00:00.000Z',
      ode: '2026-10-11T08:00:00.000Z',
      silent: '2026-10-10T21:00:00.000Z',
      hgta: '2026-09-01T10:00:00.000Z',
    }
    expect(byLastOpened(practised)).toEqual(['ode', 'silent', 'bz5', 'hgta'])
    expect(byLastOpened({})).toEqual([])
  })
})

describe('selectHolds', () => {
  it('counts a chord’s holds: three once learned, none before the first', () => {
    expect(selectHolds('bz5:chord:G')(state)).toBe(2)
    expect(selectHolds('bz5:chord:C')(state)).toBe(3)
    expect(selectHolds('bz5:chord:F')(state)).toBe(0)
  })
})
