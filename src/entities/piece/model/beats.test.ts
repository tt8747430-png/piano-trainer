import { describe, expect, it } from 'vitest'
import { readBeats, ticksIn } from './beats'

describe('ticksIn', () => {
  it.each([
    [1, 24],
    [1.5, 36],
    [0.25, 6],
    [0.125, 3],
    [1 / 3, 8],
  ])('counts %s beats as %s ticks', (beats, ticks) => {
    expect(ticksIn(beats)).toBe(ticks)
  })

  it('has no count for beats that fall between ticks', () => {
    expect(ticksIn(0.3)).toBeNull()
  })
})

describe('readBeats', () => {
  it.each([
    ['2', 2],
    ['1.5', 1.5],
    ['.5', 0.5],
    ['.125', 0.125],
    ['1:3', 1 / 3],
    ['2:3', 2 / 3],
  ])('reads %j as %s beats', (text, beats) => {
    expect(readBeats(text)).toBe(beats)
  })

  it.each(['', ' ', '0', '-1', 'two', '0:3', '1:0', '1:'])('reads %j as no beats', (text) => {
    expect(readBeats(text)).toBeNull()
  })
})
