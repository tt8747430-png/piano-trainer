import { describe, expect, it } from 'vitest'
import { barAt } from './bar-at'

const measures = [
  { x: 0, width: 200 },
  { x: 200, width: 150 },
  { x: 350, width: 150 },
]

describe('barAt', () => {
  it('finds the bar under an x, the ends for anything outside', () => {
    expect(barAt(measures, 250)).toBe(1)
    expect(barAt(measures, -40)).toBe(0)
    expect(barAt(measures, 9999)).toBe(2)
  })
})
