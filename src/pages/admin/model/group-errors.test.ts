import { describe, expect, it } from 'vitest'
import { groupErrors, splitReports } from './group-errors'

const entry = (message: string, at: string, path = '/') => ({
  message,
  at,
  path,
  stack: `at ${message}`,
  build: '1',
})

describe('groupErrors', () => {
  it('gathers the reports of one message, the latest kept, the most recent group first', () => {
    const groups = groupErrors([
      entry('A', '2026-10-29T10:00:00Z', '/a'),
      entry('B', '2026-10-29T12:00:00Z'),
      entry('A', '2026-10-29T11:00:00Z', '/b'),
      entry('A', '2026-10-28T09:00:00Z', '/a'),
    ])
    expect(groups.map(({ message, count, places }) => ({ message, count, places }))).toEqual([
      { message: 'B', count: 1, places: 1 },
      { message: 'A', count: 3, places: 2 },
    ])
    expect(groups[1]?.latest.at).toBe('2026-10-29T11:00:00Z')
  })

  it('has no group for no reports', () => {
    expect(groupErrors([])).toEqual([])
  })
})

describe('splitReports (R32)', () => {
  it('tells a learner’s own reports from the errors, the newest report first', () => {
    const { feedback, errors } = splitReports([
      entry('Report: The keys are small', '2026-10-29T10:00:00Z', '/practice'),
      entry('TypeError: x is undefined', '2026-10-29T11:00:00Z'),
      entry('Report: Add a hymn book', '2026-10-30T09:00:00Z', '/songs'),
    ])
    expect(feedback).toEqual([
      { text: 'Add a hymn book', at: '2026-10-30T09:00:00Z', path: '/songs', build: '1' },
      { text: 'The keys are small', at: '2026-10-29T10:00:00Z', path: '/practice', build: '1' },
    ])
    expect(errors.map((each) => each.message)).toEqual(['TypeError: x is undefined'])
  })
})
