import { describe, expect, it } from 'vitest'
import { fitScale, SHEET_SCALE } from './fit-scale'

const WIDE = 1440

describe('fitScale', () => {
  it('fills the height a wide room has', () => {
    expect(fitScale({ width: WIDE, height: 315 }, 210)).toBe(1.5)
    expect(fitScale({ width: WIDE, height: 168 }, 210)).toBe(0.8)
  })

  it('grows no larger than two bars across the room allow, and never past its bounds', () => {
    expect(fitScale({ width: 390, height: 600 }, 210)).toBe(1)
    expect(fitScale({ width: 900, height: 600 }, 210)).toBe(1.25)
    expect(fitScale({ width: 4000, height: 2000 }, 210)).toBe(SHEET_SCALE.max)
    expect(fitScale({ width: WIDE, height: 20 }, 210)).toBe(SHEET_SCALE.min)
  })

  it('engraves at 1 before the room is measured', () => {
    expect(fitScale({ width: 0, height: 0 }, 210)).toBe(1)
  })
})
