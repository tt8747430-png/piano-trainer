import { describe, expect, it } from 'vitest'
import {
  barTicks,
  beatGrouping,
  beatsBefore,
  beatsPerBar,
  beatStarts,
  beatsToTicks,
  beatUnit,
  isTempoUnit,
  TEMPO_UNITS,
  tempoMark,
  tempoOfMark,
  tempoUnitsFor,
  unitNote,
  unitTicks,
  COMMON_METERS,
  isCompound,
  isMeter,
  meterBeats,
  meterGroups,
  meterOf,
  meterParts,
  METERS,
  meterSymbol,
  tempoNote,
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

  it('reads a first bar against its own meter where it has one (ADR 0097)', () => {
    expect(beatsBefore([{ beats: 3, meter: '3/4' }], 0, '4/4')).toBe(0)
    expect(beatsBefore([{ beats: 2, meter: '3/4' }], 0, '4/4')).toBe(1)
  })

  it('counts beats in whole ticks', () => {
    expect([1, 0.5, 1 / 3, 2.25, 0.125].map(beatsToTicks)).toEqual([24, 12, 8, 54, 3])
  })

  it('counts twenty-four ticks a beat', () => {
    expect(TICKS_PER_BEAT).toBe(24)
  })
})

describe('meters (ADR 0114)', () => {
  it('has a count of one to twelve over a half, a quarter or an eighth', () => {
    expect(METERS).toHaveLength(36)
    expect(METERS.slice(0, 2)).toEqual(['1/2', '2/2'])
    expect(METERS.at(-1)).toBe('12/8')
    expect(METERS.every(isMeter)).toBe(true)
    expect(COMMON_METERS.every(isMeter)).toBe(true)
  })

  it('tells a meter from anything else', () => {
    expect(['5/4', '2/2', '7/8', '12/8'].every(isMeter)).toBe(true)
    expect(['13/4', '0/4', '4/16', '4/3', 'C', 4, null, '04/4'].some(isMeter)).toBe(false)
  })

  it('reads and makes a meter of its figures', () => {
    expect(meterParts('7/8')).toEqual({ count: 7, unit: 8 })
    expect(meterOf(3, 2)).toBe('3/2')
    expect(meterOf(13, 4)).toBeUndefined()
    expect(meterOf(3, 16)).toBeUndefined()
  })

  it('counts compound meters in dotted quarters, the others in quarters', () => {
    expect(METERS.filter(isCompound)).toEqual(['3/8', '6/8', '9/8', '12/8'])
    expect(
      ['2/2', '3/2', '2/4', '5/4', '6/4', '3/8', '6/8', '9/8', '12/8', '7/8'].map((m) =>
        beatsPerBar(m as never),
      ),
    ).toEqual([4, 6, 2, 5, 6, 1, 2, 3, 4, 3.5])
    expect(barTicks('2/2')).toBe(96)
    expect(barTicks('5/8')).toBe(60)
  })

  it('counts a bar’s beats: halves in x/2, quarters in x/4, dotted quarters in 6/8, eighths in twos and threes', () => {
    expect(meterBeats('2/2')).toEqual([48, 48])
    expect(meterBeats('3/2')).toEqual([48, 48, 48])
    expect(meterBeats('5/4')).toEqual([24, 24, 24, 24, 24])
    expect(meterBeats('6/8')).toEqual([24, 24])
    expect(meterBeats('3/8')).toEqual([24])
    expect(meterBeats('7/8')).toEqual([24, 24, 36])
    expect(meterBeats('5/8')).toEqual([36, 24])
  })

  it('groups five and more beats: 5/4 as 3+2, 6/4 as 3+3, 7/4 as 4+3', () => {
    expect(meterGroups('4/4')).toEqual([4])
    expect(meterGroups('5/4')).toEqual([3, 2])
    expect(meterGroups('6/4')).toEqual([3, 3])
    expect(meterGroups('7/4')).toEqual([4, 3])
    expect(meterGroups('2/2')).toEqual([2])
  })

  it('accents a bar’s first beat and each group’s', () => {
    expect(beatStarts('5/4')).toEqual([
      { tick: 0, accent: true },
      { tick: 24, accent: false },
      { tick: 48, accent: false },
      { tick: 72, accent: true },
      { tick: 96, accent: false },
    ])
    expect(beatStarts('2/2')).toEqual([
      { tick: 0, accent: true },
      { tick: 48, accent: false },
    ])
  })

  it('writes a bar as its time signature, in the meter’s own unit', () => {
    expect(timeSignature(4, '4/4')).toEqual({ count: 4, unit: 4 })
    expect(timeSignature(4, '2/2')).toEqual({ count: 2, unit: 2 })
    expect(timeSignature(1, '2/2')).toEqual({ count: 1, unit: 4 })
    expect(timeSignature(2, '4/4')).toEqual({ count: 2, unit: 4 })
    expect(timeSignature(1.5, '4/4')).toEqual({ count: 3, unit: 8 })
    expect(timeSignature(1.25, '3/4')).toEqual({ count: 5, unit: 16 })
    expect(timeSignature(4, '12/8')).toEqual({ count: 12, unit: 8 })
    expect(timeSignature(1, '6/8')).toEqual({ count: 3, unit: 8 })
    expect(timeSignature(1, '7/8')).toEqual({ count: 2, unit: 8 })
    expect(timeSignatureText(timeSignature(3, '12/8'))).toBe('9/8')
  })

  it('refuses a bar no time signature writes', () => {
    expect(() => timeSignature(1 / 3, '4/4')).toThrow(RangeError)
  })

  it('prints C for 4/4 and ¢ for 2/2 alone', () => {
    expect(meterSymbol('4/4')).toBe('common')
    expect(meterSymbol('2/2')).toBe('cut')
    expect(meterSymbol('2/4')).toBeNull()
  })
})

describe('tempoNote', () => {
  it('is a quarter in simple time and a dotted quarter in compound, the beat a tempo counts', () => {
    expect(tempoNote('4/4')).toBe('\u{1D15F}')
    expect(tempoNote('2/2')).toBe('\u{1D15F}')
    expect(tempoNote('6/8')).toBe('\u{1D15F}\u{1D16D}')
    expect(tempoNote('12/8')).toBe('\u{1D15F}\u{1D16D}')
  })
})

describe('a tempo mark’s unit (ADR 0114)', () => {
  it('offers the meter’s beat first', () => {
    expect(tempoUnitsFor('4/4')).toEqual(['4', '4.', '8', '8.', '16'])
    expect(tempoUnitsFor('2/2')).toEqual(['2', '2.', '4'])
    expect(tempoUnitsFor('6/8')[0]).toBe('4.')
    expect(beatUnit('3/4')).toBe('4')
    expect(beatUnit('12/8')).toBe('4.')
    expect(TEMPO_UNITS.every(isTempoUnit)).toBe(true)
    expect(isTempoUnit('32')).toBe(false)
  })

  it('measures a unit in the meter’s ticks', () => {
    expect(['2', '4', '4.', '8', '8.', '16'].map((u) => unitTicks(u as '4', '4/4'))).toEqual([
      48, 24, 36, 12, 18, 6,
    ])
    expect(unitTicks('4.', '6/8')).toBe(24)
    expect(unitTicks('8', '6/8')).toBe(8)
  })

  it('marks a tempo in any unit, and reads a mark back as the song’s beats a minute', () => {
    expect(tempoMark(120, '8', '4/4')).toBe(240)
    expect(tempoMark(120, '4.', '4/4')).toBe(80)
    expect(tempoMark(120, '2', '2/2')).toBe(60)
    expect(tempoMark(60, '8', '6/8')).toBe(180)
    expect(tempoOfMark(93, '8', '4/4')).toBe(46.5)
    expect(tempoOfMark(60, '2', '2/2')).toBe(120)
    expect(tempoMark(tempoOfMark(93, '8', '4/4'), '8', '4/4')).toBe(93)
  })

  it('prints a unit as its note, dotted where it is', () => {
    expect(unitNote('2')).toBe('\u{1D15E}')
    expect(unitNote('8.')).toBe('\u{1D160}\u{1D16D}')
    expect(tempoNote('2/2', '2')).toBe('\u{1D15E}')
  })
})

describe('beatGrouping (ADR 0115, 0114)', () => {
  it('groups a bar’s eighths by its counted beats', () => {
    expect(beatGrouping('2/4')).toEqual([2, 2])
    expect(beatGrouping('3/4')).toEqual([2, 2, 2])
    expect(beatGrouping('6/8')).toEqual([3, 3])
    expect(beatGrouping('2/2')).toEqual([4, 4])
    expect(beatGrouping('7/8')).toEqual([2, 2, 3])
  })
})
