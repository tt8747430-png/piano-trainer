import { describe, expect, it } from 'vitest'
import { longestLine } from './longest-line'

describe('longestLine', () => {
  it('gives each line its bars’ share of the longest line', () => {
    const { longest, shareOf } = longestLine([4, 4, 2, 1])
    expect(longest).toBe(4)
    expect([4, 2, 1].map(shareOf)).toEqual([1, 0.5, 0.25])
  })

  it('counts a sheet of no lines as one bar long', () => {
    expect(longestLine([]).longest).toBe(1)
  })
})
