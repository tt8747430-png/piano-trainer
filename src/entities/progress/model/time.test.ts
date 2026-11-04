import { describe, expect, it } from 'vitest'
import {
  practiceSeconds,
  withBestTake,
  withFirst,
  withKeyPractised,
  withPracticeTime,
} from './time'
import { EMPTY_PROGRESS } from './types'

describe('practice time', () => {
  it('adds the seconds played to their day, whole, and never past a day', () => {
    let state = withPracticeTime(EMPTY_PROGRESS, 90.7, '2026-11-03')
    state = withPracticeTime(state, 30, '2026-11-03')
    state = withPracticeTime(state, 45, '2026-11-04')
    expect(state.seconds).toEqual({ '2026-11-03': 120, '2026-11-04': 45 })
    expect(practiceSeconds(state)).toBe(165)
    expect(withPracticeTime(state, 0, '2026-11-04')).toBe(state)
    expect(withPracticeTime(state, 100_000, '2026-11-04').seconds['2026-11-04']).toBe(86_400)
  })

  it('keeps the day a key was first practised, and a first once', () => {
    const once = withKeyPractised(EMPTY_PROGRESS, 'G', '2026-11-03')
    expect(withKeyPractised(once, 'G', '2026-11-04')).toBe(once)
    expect(once.keys).toEqual({ G: '2026-11-03' })
    const published = withFirst(EMPTY_PROGRESS, 'published', '2026-11-03')
    expect(withFirst(published, 'published', '2026-11-05').firsts).toEqual({
      published: '2026-11-03',
    })
  })
})

describe('withBestTake (B1)', () => {
  it('keeps a take’s accuracy only where it beats the best', () => {
    const once = withBestTake(EMPTY_PROGRESS, 82.4)
    expect(once.bestTake).toBe(82)
    expect(withBestTake(once, 70)).toBe(once)
    expect(withBestTake(once, 100).bestTake).toBe(100)
  })
})
