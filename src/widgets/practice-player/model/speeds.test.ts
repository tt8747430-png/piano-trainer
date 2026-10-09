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
})
