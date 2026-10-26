import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT, type Expression } from '@/shared/lib/music'
import { tempoSteps, tempoWarp } from './tempo-marks'

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

  it('leaves a count-in before the music at the written tempo', () => {
    const warp = tempoWarp([{ startTick: 288, marks: { expression: 'rit' } }])
    expect([-96, -48, 0].map(warp)).toEqual([-96, -48, 0])
  })
})

describe('tempoSteps', () => {
  it('keeps the written tempo throughout where no tempo is marked', () => {
    expect(tempoSteps([at(0), at(beat, 'dolce')])).toEqual([{ tick: 0, factor: 1 }])
  })

  it('slows a 32nd at a time over a rit.’s two beats to three quarters, then back at a tempo', () => {
    const steps = tempoSteps([at(4 * beat, 'rit'), at(8 * beat, 'a-tempo')])
    expect(steps[0]).toEqual({ tick: 0, factor: 1 })
    const slowing = steps.filter((step) => step.tick >= 4 * beat && step.tick < 6 * beat)
    // A step for each 32nd of the two beats, each slower than the last.
    expect(slowing).toHaveLength(16)
    expect(slowing.every((step, i) => step.factor < (slowing[i - 1]?.factor ?? 1))).toBe(true)
    expect(steps.slice(-2)).toEqual([
      { tick: 6 * beat, factor: 0.75 },
      { tick: 8 * beat, factor: 1 },
    ])
  })

  it('times the music as the warp does, step by step', () => {
    const marked = [at(beat, 'accel'), at(5 * beat, 'rit'), at(9 * beat, 'a-tempo')]
    const steps = tempoSteps(marked)
    const warp = tempoWarp(marked)
    // Each step lasts its ticks over its factor: summed, where the warp puts its end.
    const timed = (tick: number) =>
      steps.reduce((time, step, i) => {
        const end = Math.min(tick, steps[i + 1]?.tick ?? Infinity)
        return end > step.tick ? time + (end - step.tick) / step.factor : time
      }, 0)
    for (const tick of [beat, 2 * beat, 3 * beat, 6 * beat, 9 * beat, 12 * beat])
      expect(timed(tick)).toBeCloseTo(warp(tick), 9)
  })
})
