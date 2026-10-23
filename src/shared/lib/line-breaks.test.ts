import { describe, expect, it } from 'vitest'
import { breakLine } from './line-breaks'

describe('breakLine', () => {
  it('keeps a line whole that fits', () => {
    expect(breakLine([100, 100, 100, 100], 400)).toEqual([4])
  })

  it('cuts a line into as few lines as hold it, as even as they come', () => {
    // Greedy would give 3 + 1; balanced gives 2 + 2.
    expect(breakLine([100, 100, 100, 100], 300)).toEqual([2, 2])
    expect(breakLine([100, 100, 100, 100, 100], 300)).toEqual([3, 2])
  })

  it('balances by width, not by count: a dense bar goes with a light one', () => {
    expect(breakLine([250, 60, 60, 60, 60], 300)).toEqual([1, 4])
    expect(breakLine([200, 60, 200, 60], 280)).toEqual([2, 2])
  })

  it('puts a bar wider than the room on a line of its own', () => {
    expect(breakLine([100, 500, 100], 300)).toEqual([1, 1, 1])
  })

  it('keeps any number of bars on one line where the room is not known', () => {
    expect(breakLine([100, 100, 100], Infinity)).toEqual([3])
    expect(breakLine([], 300)).toEqual([])
  })
})
