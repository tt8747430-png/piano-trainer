import { describe, expect, it } from 'vitest'
import { centreOf, columnOf } from './zigzag'

describe('a journey’s zigzag', () => {
  it('swings from the middle to either side and back', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(columnOf)).toEqual([1, 0, 1, 2, 1, 0, 1, 2])
  })

  it('centres each column in its third of the width', () => {
    expect([0, 1, 2].map((column) => Math.round(centreOf(column as 0 | 1 | 2)))).toEqual([
      17, 50, 83,
    ])
  })
})
