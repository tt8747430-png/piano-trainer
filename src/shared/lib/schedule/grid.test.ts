import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { barClicks, barGrid, countInBeats } from './grid'

const B = TICKS_PER_BEAT

const bars = (meter: '2/2' | '5/4' | '6/8' | '7/8' | '4/4', ...ticks: number[]) => {
  let start = 0
  return {
    meter,
    bars: ticks.map((each) => {
      const bar = { startTick: start, beats: each / B }
      start += each
      return bar
    }),
  }
}

describe('the bar grid (ADR 0114)', () => {
  it('clicks twice a bar in 2/2, on its halves', () => {
    expect(barClicks(bars('2/2', 4 * B, 4 * B), 1)).toEqual([
      { tick: 4 * B, accent: true },
      { tick: 6 * B, accent: false },
    ])
  })

  it('accents 5/4 on its first beat and its fourth (3+2)', () => {
    expect(barClicks(bars('5/4', 5 * B), 0).map(({ accent }) => accent)).toEqual([
      true,
      false,
      false,
      true,
      false,
    ])
  })

  it('counts 7/8 in its twos and three', () => {
    expect(barClicks(bars('7/8', 3.5 * B), 0).map(({ tick }) => tick)).toEqual([0, B, 2 * B])
  })

  it('counts a pickup’s beats from where its bar would begin', () => {
    const music = bars('2/2', 2 * B, 4 * B)
    expect(barGrid(music, 0).start).toBe(-2 * B)
    expect(barClicks(music, 0)).toEqual([{ tick: 0, accent: false }])
  })

  it('counts in a bar of 2/2 as two clicks', () => {
    expect(countInBeats(bars('2/2', 4 * B), 0)).toEqual([
      { tick: -4 * B, accent: true },
      { tick: -2 * B, accent: false },
    ])
  })

  it('counts in a pickup on the beats of the bar it ends', () => {
    expect(countInBeats(bars('4/4', B, 4 * B), 0)).toEqual([
      { tick: -4 * B, accent: false },
      { tick: -3 * B, accent: true },
      { tick: -2 * B, accent: false },
      { tick: -B, accent: false },
    ])
  })

  it('clicks a short bar on its own beats from its start', () => {
    expect(barClicks(bars('4/4', 4 * B, 2 * B), 1)).toEqual([
      { tick: 4 * B, accent: true },
      { tick: 5 * B, accent: false },
    ])
  })
})
