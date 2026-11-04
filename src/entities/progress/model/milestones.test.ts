import { describe, expect, it } from 'vitest'
import { earnedKeys, levelOf, profileFigures, withEarned } from './milestones'
import { EMPTY_PROGRESS, type ProgressState } from './types'

const KEPT = { recordings: 0, ownSongs: 0, folders: 0 }

describe('milestones', () => {
  it('each milestone earned once, with its day', () => {
    const state: ProgressState = {
      ...EMPTY_PROGRESS,
      learned: { 'piece:bz5': '2026-11-01' } as ProgressState['learned'],
      firsts: { published: '2026-11-02' },
    }
    const figures = profileFigures(state, { ...KEPT, recordings: 1 })
    expect(earnedKeys(figures)).toEqual([
      'repertoire:1',
      'first-song',
      'first-recording',
      'first-published',
    ])
    const first = withEarned(state, figures, '2026-11-03')
    expect(first.earned).toEqual({
      'repertoire:1': '2026-11-03',
      'first-song': '2026-11-03',
      'first-recording': '2026-11-03',
      'first-published': '2026-11-03',
    })
    // Reached again on a later day: the first day stands, and nothing is written.
    expect(withEarned(first, figures, '2026-11-04')).toBe(first)
  })

  it('keeps the day each tier was first reached', () => {
    const days = ['2026-11-01', '2026-11-02', '2026-11-03']
    const state = { ...EMPTY_PROGRESS, days }
    const earned = withEarned(state, profileFigures(state, KEPT), '2026-11-03')
    expect(earned.earned).toEqual({ 'streak:1': '2026-11-03' })
  })

  it('level from practice minutes', () => {
    const minutes = (m: number) => levelOf(m * 60)
    expect([0, 9, 10, 39, 40, 90, 159, 160].map(minutes)).toEqual([0, 0, 1, 1, 2, 3, 3, 4])
  })

  it('counts the best accuracy of any run', () => {
    const state: ProgressState = {
      ...EMPTY_PROGRESS,
      trainers: {
        'name-chord:1': { runs: 2, last: 80, best: 90, bestStreak: 4 },
        'intervals:2': { runs: 1, last: 100, best: 100, bestStreak: 9 },
      },
    }
    expect(profileFigures(state, KEPT).bestAccuracy).toBe(100)
  })
})
