import { describe, expect, it } from 'vitest'
import { percentOf, speedTempo, stepTempo } from './speeds'

describe('speeds', () => {
  it('takes a share of the piece’s tempo, rounded, within the range', () => {
    expect(speedTempo(72, 0.5)).toBe(36)
    expect(speedTempo(76, 0.75)).toBe(57)
    expect(speedTempo(30, 0.5)).toBe(20)
  })

  it('says a tempo as a share of the piece’s', () => {
    expect(percentOf(54, 72)).toBe(75)
    expect(percentOf(60, 72)).toBe(83)
  })

  it('steps a tempo to the next 5% of the piece’s, up or down, within the range', () => {
    expect(stepTempo(72, 72, -1)).toBe(68)
    // 68 of 72 reads as 94%: the step down from there is 90%.
    expect(stepTempo(68, 72, -1)).toBe(65)
    expect(stepTempo(65, 72, 1)).toBe(68)
    expect(stepTempo(72, 72, 1)).toBe(76)
    expect(stepTempo(160, 160, 1)).toBe(160)
    expect(stepTempo(20, 100, -1)).toBe(20)
  })

  it('keeps stepping until the tempo changes, down to the range’s foot and up to its top', () => {
    const steps = (from: number, own: number, by: -1 | 1): number[] => {
      const tempos = [from]
      for (let i = 0; i < 60; i += 1) tempos.push(stepTempo(tempos.at(-1) ?? from, own, by))
      return tempos
    }
    for (const own of [54, 56, 72, 76]) {
      const down = steps(own, own, -1)
      const end = down.indexOf(20)
      expect(end).toBeGreaterThan(0)
      down.slice(1, end + 1).forEach((tempo, i) => expect(tempo).toBeLessThan(down[i] ?? 0))
    }
    const up = steps(28, 56, 1)
    expect(up.slice(1, 4)).toEqual([31, 34, 36])
    const top = up.indexOf(160)
    expect(top).toBeGreaterThan(0)
    up.slice(1, top + 1).forEach((tempo, i) => expect(tempo).toBeGreaterThan(up[i] ?? 0))
  })
})
