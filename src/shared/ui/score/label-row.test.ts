import { describe, expect, it } from 'vitest'
import { labelRow, labelScale } from './label-row'

describe('the labels’ row over a line', () => {
  it('is the chord row’s height with chord names, its bars’ labels’ alone without, at the line’s size', () => {
    expect(labelRow(true)).toBe(44)
    expect(labelRow(false)).toBe(20)
    expect(labelRow(true, 1.2)).toBe(44)
    expect(labelRow(true, 0.5)).toBe(31)
  })

  it('draws labels no smaller than they can be read', () => {
    expect(labelScale(0.4)).toBe(0.7)
    expect(labelScale(0.85)).toBe(0.85)
    expect(labelScale(1.3)).toBe(1)
  })

  it('draws a page’s chord symbols 2.6 staff spaces tall, as they print', () => {
    expect(labelScale(0.6, true) * 18).toBeCloseTo(2.6 * 10 * 0.6)
  })
})
