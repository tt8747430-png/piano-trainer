import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT, type Expression } from '@/shared/lib/music'
import { tempoWarp } from './tempo-marks'

const beat = TICKS_PER_BEAT
const at = (startTick: number, expression?: Expression) => ({
  startTick,
  ...(expression ? { marks: { expression } } : {}),
})

describe('tempoWarp', () => {
  it('keeps the time as it is where no tempo is marked', () => {
    const warp = tempoWarp([at(0), at(beat)])
    expect(warp(4 * beat)).toBe(4 * beat)
  })

  it('slows from a rit. over two beats to three quarters of the tempo, until a tempo', () => {
    const warp = tempoWarp([at(0, 'rit'), at(8 * beat, 'a-tempo')])
    // Slowing: the two beats take longer than two, then each beat a third longer.
    expect(warp(2 * beat)).toBeGreaterThan(2 * beat)
    expect(warp(6 * beat) - warp(4 * beat)).toBeCloseTo((2 * beat) / 0.75)
    // Back in tempo: a beat is a beat again.
    expect(warp(10 * beat) - warp(9 * beat)).toBeCloseTo(beat)
  })

  it('presses on from an accel., each beat shorter', () => {
    const warp = tempoWarp([at(0, 'accel')])
    expect(warp(6 * beat) - warp(4 * beat)).toBeCloseTo((2 * beat) / 1.25)
  })
})
