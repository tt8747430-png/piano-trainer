import { describe, expect, it } from 'vitest'
import { practiceRecord } from './record'
import { EMPTY_PROGRESS, type ProgressState } from './types'

describe('practiceRecord', () => {
  it('counts nothing for a learner who has done nothing', () => {
    expect(practiceRecord(EMPTY_PROGRESS)).toEqual({
      daysPractised: 0,
      bestStreak: 0,
      stepsLearned: 0,
      lessonsDone: 0,
      songsPlayed: 0,
      skillsKnown: 0,
    })
  })

  it('counts the days, the longest run of them, and what was learned, done and played', () => {
    const known = { correct: true, at: '2026-10-01T10:00:00Z' }
    const state: ProgressState = {
      ...EMPTY_PROGRESS,
      days: ['2026-09-28', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-05'],
      learned: { 'chords:tri': '2026-10-01', 'scales:c': '2026-10-02' } as ProgressState['learned'],
      lessons: { 'bz5:overview': '2026-10-01' } as ProgressState['lessons'],
      practised: { bz5: '2026-10-01', bz6: '2026-10-02' } as ProgressState['practised'],
      answers: {
        'chord:maj': [known, known, known, known, known],
        'chord:min': [{ correct: false, at: '2026-10-01T10:00:00Z' }],
      } as ProgressState['answers'],
    }
    expect(practiceRecord(state)).toEqual({
      daysPractised: 5,
      bestStreak: 3,
      stepsLearned: 2,
      lessonsDone: 1,
      songsPlayed: 2,
      skillsKnown: 1,
    })
  })
})
