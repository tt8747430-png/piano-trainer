import { describe, expect, it } from 'vitest'
import { percentOf, speedTempo } from './speeds'

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
})
