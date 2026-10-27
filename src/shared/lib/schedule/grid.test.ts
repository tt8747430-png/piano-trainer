import { describe, expect, it } from 'vitest'
import { barClicks, barGrid, countInBeats } from './grid'

const bars = (meter: '2/2' | '5/4' | '6/8' | '7/8' | '4/4', ...ticks: number[]) => {
  let start = 0
  return {
    meter,
    bars: ticks.map((each) => {
      const bar = { startTick: start, beats: each / 24 }
      start += each
      return bar
    }),
  }
}

describe('the bar grid (ADR 0114)', () => {
  it('clicks twice a bar in 2/2, on its halves', () => {
    expect(barClicks(bars('2/2', 96, 96), 1)).toEqual([
      { tick: 96, accent: true },
      { tick: 144, accent: false },
    ])
  })

  it('accents 5/4 on its first beat and its fourth (3+2)', () => {
    expect(barClicks(bars('5/4', 120), 0).map(({ accent }) => accent)).toEqual([
      true,
      false,
      false,
      true,
      false,
    ])
  })

  it('counts 7/8 in its twos and three', () => {
    expect(barClicks(bars('7/8', 84), 0).map(({ tick }) => tick)).toEqual([0, 24, 48])
  })

  it('counts a pickup’s beats from where its bar would begin', () => {
    const music = bars('2/2', 48, 96)
    expect(barGrid(music, 0).start).toBe(-48)
    expect(barClicks(music, 0)).toEqual([{ tick: 0, accent: false }])
  })

  it('counts in a bar of 2/2 as two clicks', () => {
    expect(countInBeats(bars('2/2', 96), 0)).toEqual([
      { tick: -96, accent: true },
      { tick: -48, accent: false },
    ])
  })

  it('counts in a pickup on the beats of the bar it ends', () => {
    expect(countInBeats(bars('4/4', 24, 96), 0)).toEqual([
      { tick: -96, accent: false },
      { tick: -72, accent: true },
      { tick: -48, accent: false },
      { tick: -24, accent: false },
    ])
  })

  it('clicks a short bar on its own beats from its start', () => {
    expect(barClicks(bars('4/4', 96, 48), 1)).toEqual([
      { tick: 96, accent: true },
      { tick: 120, accent: false },
    ])
  })
})
