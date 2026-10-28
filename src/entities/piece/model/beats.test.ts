import { describe, expect, it } from 'vitest'
import { readBeats, ticksIn } from './beats'

describe('ticksIn', () => {
  it.each([
    [1, 5040],
    [1.5, 7560],
    [0.25, 1260],
    [0.0625, 315],
    [1 / 3, 1680],
    [1 / 5, 1008],
    [1 / 7, 720],
  ])('counts %s beats as %s ticks', (beats, ticks) => {
    expect(ticksIn(beats)).toBe(ticks)
  })

  it('has no count for beats that fall between ticks', () => {
    expect(ticksIn(0.0001)).toBeNull()
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
    ['.0625', 0.0625],
    ['1:7', 1 / 7],
  ])('reads %j as %s beats', (text, beats) => {
    expect(readBeats(text)).toBe(beats)
  })

  it.each(['', ' ', '0', '-1', 'two', '0:3', '1:0', '1:'])('reads %j as no beats', (text) => {
    expect(readBeats(text)).toBeNull()
  })
})
