import { describe, expect, it } from 'vitest'
import { columnGaps, fitGaps, idealSpace } from './spacing'

describe('LilyPond’s note spacing', () => {
  it('gives each doubling of a note’s length 1.2 staff spaces more, from 2.4 for the shortest', () => {
    expect(idealSpace(12, 12)).toBeCloseTo(2.4)
    expect(idealSpace(24, 12)).toBeCloseTo(3.6)
    expect(idealSpace(48, 12)).toBeCloseTo(4.8)
    expect(idealSpace(96, 12)).toBeCloseTo(6)
  })

  it('spaces a note shorter than the shortest by its share of it', () => {
    expect(idealSpace(6, 12)).toBeCloseTo(1.2)
  })

  it('fits the gaps to a width in proportion, none under its least', () => {
    expect(fitGaps([2, 4], [0, 0], 60)).toEqual([20, 40])
    expect(fitGaps([1, 1, 4], [30, 0, 0], 60)).toEqual([30, 6, 24])
    // Narrower than the least: each at its least.
    expect(fitGaps([1, 1], [40, 40], 60)).toEqual([40, 40])
  })

  it('reads a bar’s columns: each gap the time to the next onset, the shortest never past 3/16', () => {
    // A half, then two quarters (a quarter 24): the shortest taken as 3/16 (18), as LilyPond's base.
    const gaps = columnGaps([0, 48, 72], 96, 18)
    expect(gaps).toHaveLength(3)
    expect(gaps[0]! / gaps[1]!).toBeCloseTo(idealSpace(48, 18) / idealSpace(24, 18))
    expect(gaps[1]).toBeCloseTo(gaps[2]!)
    // Sixteenths among them: the shortest is theirs.
    expect(columnGaps([0, 6, 12], 36, 18)[0]).toBeCloseTo(idealSpace(6, 6))
  })
})
