import { describe, expect, it } from 'vitest'
import {
  beatsBefore,
  beatsToTicks,
  isMeter,
  tempoNote,
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

  it('reads a first bar against its own meter where it has one (ADR 0095)', () => {
    expect(beatsBefore([{ beats: 3, meter: '3/4' }], 0, '4/4')).toBe(0)
    expect(beatsBefore([{ beats: 2, meter: '3/4' }], 0, '4/4')).toBe(1)
  })

  it('counts beats in whole ticks', () => {
    expect([1, 0.5, 1 / 3, 2.25, 0.125].map(beatsToTicks)).toEqual([24, 12, 8, 54, 3])
  })

  it('counts twenty-four ticks a beat', () => {
    expect(TICKS_PER_BEAT).toBe(24)
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

describe('tempoNote', () => {
  it('is a quarter in x/4 and a dotted quarter in x/8, the beat a tempo counts', () => {
    expect(tempoNote('4/4')).toBe('\u{1D15F}')
    expect(tempoNote('6/8')).toBe('\u{1D15F}\u{1D16D}')
    expect(tempoNote('12/8')).toBe('\u{1D15F}\u{1D16D}')
  })
})
