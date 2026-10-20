import { describe, expect, it } from 'vitest'
import type { Meter } from '@/shared/lib/music'
import { ticksOf, valuesOf } from './values'

const ticks = (meter: Meter, triplet = false) =>
  valuesOf(meter, triplet).map((duration) => ticksOf(duration, meter))

describe('valuesOf', () => {
  it('writes x/4 from the double-dotted whole to the 32nd', () => {
    expect(ticks('4/4')).toEqual([168, 144, 96, 84, 72, 48, 42, 36, 24, 21, 18, 12, 9, 6, 3])
  })

  it('writes a triplet beat in triplet values', () => {
    expect(ticks('3/4', true)).toEqual([64, 32, 16, 8, 4, 2])
  })

  it('writes x/8 from the double-dotted whole to the 32nd, and never in triplets', () => {
    expect(ticks('6/8')).toEqual([112, 96, 64, 56, 48, 32, 28, 24, 16, 14, 12, 8, 7, 6, 4, 3, 2])
    expect(valuesOf('12/8', true)).toEqual([])
  })
})

describe('ticksOf', () => {
  it('counts a value in the meter’s ticks', () => {
    expect(ticksOf({ value: 4, dots: 0, triplet: false }, '4/4')).toBe(24)
    expect(ticksOf({ value: 4, dots: 1, triplet: false }, '12/8')).toBe(24)
    expect(ticksOf({ value: 8, dots: 0, triplet: true }, '2/4')).toBe(8)
    expect(ticksOf({ value: 4, dots: 2, triplet: false }, '4/4')).toBe(42)
  })
})
