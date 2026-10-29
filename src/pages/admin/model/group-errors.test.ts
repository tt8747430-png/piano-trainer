import { describe, expect, it } from 'vitest'
import { groupErrors } from './group-errors'

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
