import { describe, expect, it } from 'vitest'
import { barTicks, meterOf, TICKS_PER_BEAT } from '@/shared/lib/music'
import { barRange, beatGrid, snapRange } from './beats'

const Q = TICKS_PER_BEAT
const bars = (count: number, unit: 2 | 4 | 8, n = 3) => {
  const meter = meterOf(count, unit)
  if (!meter) throw new Error('no meter')
  const ticks = barTicks(meter)
  return Array.from({ length: n }, (_, at) => ({
    startTick: at * ticks,
    ticks,
    time: { count, unit },
  }))
}

describe('beatGrid', () => {
  it('counts 4/4 in four quarters, 2/4 in two, 6/8 in two dotted quarters', () => {
    expect(beatGrid(bars(4, 4, 1)).map((beat) => beat.tick)).toEqual([0, Q, 2 * Q, 3 * Q])
    expect(beatGrid(bars(2, 4, 1))).toHaveLength(2)
    // A compound bar's beat, a dotted quarter, is one beat's ticks (the music's own count).
    expect(beatGrid(bars(6, 8, 1)).map((beat) => beat.end - beat.tick)).toEqual([Q, Q])
  })
})

describe('barRange', () => {
  it('a tap in bar 3 of 4/4 takes its four beats, bar line to bar line', () => {
    const grid = beatGrid(bars(4, 4))
    expect(barRange(grid, 2)).toEqual({ from: 8 * Q, to: 12 * Q })
  })

  it('takes two beats in 2/4', () => {
    const grid = beatGrid(bars(2, 4))
    expect(barRange(grid, 1)).toEqual({ from: 2 * Q, to: 4 * Q })
  })
})

describe('snapRange', () => {
  it('snaps a drag from beat 2 of bar 1 to beat 3 of bar 2 to 1.2–2.3', () => {
    const grid = beatGrid(bars(4, 4))
    expect(snapRange({ from: Q + 100, to: 4 * Q + 2 * Q + 10 }, grid)).toEqual({
      from: Q,
      to: 7 * Q,
    })
  })

  it('keeps a range already on its beats', () => {
    const grid = beatGrid(bars(4, 4))
    expect(snapRange({ from: 4 * Q, to: 8 * Q }, grid)).toEqual({ from: 4 * Q, to: 8 * Q })
  })
})
