import { describe, expect, it } from 'vitest'
import { dateOfDay, DAYS_KEPT, lastWeek, localDay, streak, withDay } from './days'
import { EMPTY_PROGRESS } from './types'

describe('localDay', () => {
  it('names the day on the learner’s own calendar', () => {
    expect(localDay(new Date(2026, 9, 11, 23, 59))).toBe('2026-10-11')
    expect(localDay(new Date(2026, 0, 2, 0, 1))).toBe('2026-01-02')
  })
})

describe('withDay', () => {
  it('keeps each day once, in order, and only the latest DAYS_KEPT', () => {
    const once = withDay(EMPTY_PROGRESS, '2026-10-11')
    expect(withDay(once, '2026-10-11')).toBe(once)
    expect(withDay(once, '2026-10-12').days).toEqual(['2026-10-11', '2026-10-12'])
    const days = Array.from({ length: DAYS_KEPT }, (_, i) => localDay(dateOfDay('2025-01-01', i)))
    const next = withDay({ ...EMPTY_PROGRESS, days }, '2027-01-01').days
    expect(next).toHaveLength(DAYS_KEPT)
    expect(next.at(-1)).toBe('2027-01-01')
    expect(next[0]).toBe('2025-01-02')
  })
})

describe('streak', () => {
  const days = ['2026-10-01', '2026-10-08', '2026-10-09', '2026-10-10']

  it('counts the days in a row up to today', () => {
    expect(streak([...days, '2026-10-11'], '2026-10-11')).toBe(4)
  })

  it('still counts a streak up to yesterday: today can keep it', () => {
    expect(streak(days, '2026-10-11')).toBe(3)
  })

  it('is broken by a day missed', () => {
    expect(streak(days, '2026-10-12')).toBe(0)
    expect(streak([], '2026-10-12')).toBe(0)
  })

  it('counts across a month’s end', () => {
    expect(streak(['2026-09-29', '2026-09-30', '2026-10-01'], '2026-10-01')).toBe(3)
  })
})

describe('lastWeek', () => {
  it('is the seven days up to today, each practised or not', () => {
    expect(lastWeek(['2026-10-01', '2026-10-06', '2026-10-11'], '2026-10-11')).toEqual([
      { day: '2026-10-05', practised: false },
      { day: '2026-10-06', practised: true },
      { day: '2026-10-07', practised: false },
      { day: '2026-10-08', practised: false },
      { day: '2026-10-09', practised: false },
      { day: '2026-10-10', practised: false },
      { day: '2026-10-11', practised: true },
    ])
  })
})

describe('dateOfDay', () => {
  it('is the day at noon, counted on by the calendar across a month and a clock change', () => {
    expect(dateOfDay('2026-10-11')).toEqual(new Date(2026, 9, 11, 12))
    expect(localDay(dateOfDay('2026-10-30', 3))).toBe('2026-11-02')
    expect(localDay(dateOfDay('2026-03-28', 2))).toBe('2026-03-30')
  })
})
