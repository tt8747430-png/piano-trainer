import { describe, expect, it } from 'vitest'
import { readBeats, ticksIn } from './beats'

describe('ticksIn', () => {
  it.each([
    [1, 12],
    [1.5, 18],
    [0.25, 3],
    [1 / 3, 4],
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
  ])('reads %j as %s beats', (text, beats) => {
    expect(readBeats(text)).toBe(beats)
  })

  it.each(['', ' ', '0', '-1', 'two'])('reads %j as no beats', (text) => {
    expect(readBeats(text)).toBeNull()
  })
})
