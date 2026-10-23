import { describe, expect, it } from 'vitest'
import { reachLoop } from './loop-reach'

describe('reachLoop (ADR 0088)', () => {
  it('begins at the cursor’s bar and takes the next with Shift →, the one before with Shift ←', () => {
    expect(reachLoop(null, null, 3, 'bar', 1, 8)).toEqual({
      loop: { first: 3, last: 4 },
      anchor: 3,
    })
    expect(reachLoop(null, null, 3, 'bar', -1, 8)).toEqual({
      loop: { first: 2, last: 3 },
      anchor: 3,
    })
  })

  it('moves the loop’s far end, shrinking as it comes back over its start', () => {
    const grown = reachLoop({ first: 3, last: 4 }, 3, 4, 'bar', 1, 8)
    expect(grown.loop).toEqual({ first: 3, last: 5 })
    expect(reachLoop(grown.loop, 3, 5, 'bar', -1, 8).loop).toEqual({ first: 3, last: 4 })
    // Back past where it began: the bars before it.
    expect(reachLoop({ first: 3, last: 3 }, 3, 3, 'bar', -1, 8).loop).toEqual({
      first: 2,
      last: 3,
    })
    expect(reachLoop({ first: 2, last: 3 }, 3, 3, 'bar', -1, 8).loop).toEqual({
      first: 1,
      last: 3,
    })
  })

  it('reaches the first or last bar with Shift Home or End, and stays inside the piece', () => {
    expect(reachLoop({ first: 3, last: 4 }, null, 4, 'end', 1, 8).loop).toEqual({
      first: 3,
      last: 7,
    })
    expect(reachLoop(null, null, 5, 'end', -1, 8).loop).toEqual({ first: 0, last: 5 })
    expect(reachLoop({ first: 6, last: 7 }, 6, 7, 'bar', 1, 8).loop).toEqual({ first: 6, last: 7 })
  })

  it('starts from the loop’s start where the anchor is not one of its ends (a loop set by the button)', () => {
    expect(reachLoop({ first: 2, last: 2 }, 9, 2, 'bar', 1, 8)).toEqual({
      loop: { first: 2, last: 3 },
      anchor: 2,
    })
  })
})
