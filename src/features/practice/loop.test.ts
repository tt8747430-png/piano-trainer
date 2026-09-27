import { describe, expect, it } from 'vitest'
import { isLoopParam, loopBeatGroups, loopParam, loopTicks, readLoop } from './loop'
import { TWO_BARS } from './testing/performances'

describe('the loop’s param', () => {
  it('writes bars as printed, and reads them back', () => {
    expect(loopParam({ first: 2, last: 5 })).toBe('3-6')
    expect(readLoop('3-6', 12)).toEqual({ first: 2, last: 5 })
  })

  it.each(['3', '6-3', '0-2', 'a-b', 3, null])('refuses %j', (value) => {
    expect(isLoopParam(value)).toBe(false)
  })

  it('has no loop past the piece’s last bar', () => {
    expect(readLoop('40-44', 12)).toBeNull()
    expect(readLoop(undefined, 12)).toBeNull()
  })
})

describe('a loop in a performance', () => {
  it('spans its bars’ beat groups and ticks', () => {
    expect(loopBeatGroups(TWO_BARS, { first: 1, last: 1 })).toEqual({ first: 4, last: 7 })
    expect(loopTicks(TWO_BARS, { first: 1, last: 1 })).toEqual({ from: 48, to: 96 })
  })
})
