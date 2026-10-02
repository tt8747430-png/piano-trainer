import { describe, expect, it } from 'vitest'
import {
  beatsBefore,
  beatsToTicks,
  isMeter,
  beatsPerBar,
  isCompound,
  METERS,
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
} from './time'

describe('time', () => {
  it('reads a first bar shorter than the meter as a pickup: the end of a bar', () => {
    const bars = [{ beats: 1 }, { beats: 4 }, { beats: 2 }]
    expect(bars.map((_, index) => beatsBefore(bars, index, '4/4'))).toEqual([3, 0, 0])
    expect(beatsBefore([{ beats: 3 }], 0, '3/4')).toBe(0)
  })

  it('counts beats in whole ticks', () => {
    expect([1, 0.5, 1 / 3, 2.25].map(beatsToTicks)).toEqual([12, 6, 4, 27])
  })

  it('counts twelve ticks a beat', () => {
    expect(TICKS_PER_BEAT).toBe(12)
  })

  it('counts compound meters in dotted quarters', () => {
    expect(METERS.map(beatsPerBar)).toEqual([2, 3, 4, 2, 4])
    expect(METERS.filter(isCompound)).toEqual(['6/8', '12/8'])
  })

  it('writes a bar as its time signature, in the meter’s own unit', () => {
    expect(timeSignature(4, '4/4')).toEqual({ count: 4, unit: 4 })
    expect(timeSignature(2, '4/4')).toEqual({ count: 2, unit: 4 })
    expect(timeSignature(1.5, '4/4')).toEqual({ count: 3, unit: 8 })
    expect(timeSignature(1.25, '3/4')).toEqual({ count: 5, unit: 16 })
    expect(timeSignature(4, '12/8')).toEqual({ count: 12, unit: 8 })
    expect(timeSignature(1, '6/8')).toEqual({ count: 3, unit: 8 })
    expect(timeSignatureText(timeSignature(3, '12/8'))).toBe('9/8')
  })

  it('refuses a bar no time signature writes', () => {
    expect(() => timeSignature(1 / 3, '4/4')).toThrow(RangeError)
  })
})

describe('isMeter', () => {
  it('tells the five meters from anything else', () => {
    expect(METERS.every(isMeter)).toBe(true)
    expect(['5/4', 4, null].some(isMeter)).toBe(false)
  })
})
