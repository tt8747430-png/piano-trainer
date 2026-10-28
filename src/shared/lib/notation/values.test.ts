import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT, type Meter } from '@/shared/lib/music'
import type { Tuplet } from './types'
import { ticksOf, tupletOf, valuesOf } from './values'

const B = TICKS_PER_BEAT

/** Each value the meter writes, in beats. */
const beats = (meter: Meter, tuplet?: Tuplet) =>
  valuesOf(meter, tuplet).map((duration) => ticksOf(duration, meter) / B)

describe('valuesOf', () => {
  it('writes x/4 from the double-dotted whole to the 64th', () => {
    expect(beats('4/4')).toEqual([
      7, 6, 4, 3.5, 3, 2, 1.75, 1.5, 1, 0.875, 0.75, 0.5, 0.4375, 0.375, 0.25, 0.1875, 0.125,
      0.0625,
    ])
  })

  it('writes a triplet in triplet values, plain or dotted, a 64th’s the shortest', () => {
    expect(beats('3/4', { num: 3, numbase: 2 })).toEqual(
      [6, 4, 3, 2, 1.5, 1, 0.75, 0.5, 0.375, 0.25, 0.1875, 0.125, 0.09375, 0.0625].map(
        (plain) => (plain * 2) / 3,
      ),
    )
  })

  it('writes x/8 from the double-dotted whole to the 64th, its beat a dotted quarter', () => {
    const eighths = beats('6/8').map((each) => each * 3)
    expect(eighths.slice(0, 4)).toEqual([14, 12, 8, 7])
    expect(eighths.at(-1)).toBe(0.125)
  })
})

describe('ticksOf', () => {
  it('counts a value in the meter’s ticks, a tuplet’s its share of the notes it takes the time of', () => {
    expect(ticksOf({ value: 4, dots: 0 }, '4/4')).toBe(B)
    expect(ticksOf({ value: 4, dots: 1 }, '12/8')).toBe(B)
    expect(ticksOf({ value: 8, dots: 0, tuplet: { num: 3, numbase: 2 } }, '2/4')).toBe(B / 3)
    expect(ticksOf({ value: 4, dots: 2 }, '4/4')).toBe(1.75 * B)
    expect(ticksOf({ value: 64, dots: 0 }, '4/4')).toBe(B / 16)
    expect(ticksOf({ value: 16, dots: 0, tuplet: { num: 5, numbase: 4 } }, '4/4')).toBe(B / 5)
    expect(ticksOf({ value: 16, dots: 0, tuplet: { num: 7, numbase: 4 } }, '4/4')).toBe(B / 7)
    expect(ticksOf({ value: 8, dots: 0, tuplet: { num: 2, numbase: 3 } }, '6/8')).toBe(B / 2)
  })
})

describe('tupletOf', () => {
  it('takes the time of the value next under it in simple time: 3:2, 5:4, 6:4, 7:4, 9:8', () => {
    expect([3, 5, 6, 7, 9].map((num) => tupletOf(num, '4/4')?.numbase)).toEqual([2, 4, 4, 4, 8])
  })

  it('takes the time of the beat’s eighths or sixteenths in compound time: 2:3, 4:3, 5:3, 7:6, 8:6, 9:6', () => {
    expect([2, 4, 5, 7, 8, 9].map((num) => tupletOf(num, '6/8')?.numbase)).toEqual([
      3, 3, 3, 6, 6, 6,
    ])
  })

  it('is none where the meter’s own values write the notes: two, four or eight to a simple beat, three or six to a compound one', () => {
    expect([2, 4, 8].map((num) => tupletOf(num, '3/4'))).toEqual([null, null, null])
    expect([3, 6].map((num) => tupletOf(num, '12/8'))).toEqual([null, null])
  })
})
