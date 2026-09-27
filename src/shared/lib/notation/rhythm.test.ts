import { describe, expect, it } from 'vitest'
import type { Meter } from '@/shared/lib/music'
import { spellSpan, voiceGrid, type Span } from './rhythm'
import { ticksOf } from './values'

/** A span spelled among its voice's other spans: each piece's tick, length and whether it is a triplet. */
function spell(
  start: number,
  end: number,
  meter: Meter = '4/4',
  others: Span[] = [],
  barTicks = 48,
) {
  const grid = voiceGrid([{ start, end }, ...others], meter)
  return spellSpan({ start, end }, { meter, barTicks, grid }).map(({ tick, duration }) => [
    tick,
    ticksOf(duration, meter),
    duration.triplet,
  ])
}

describe('spellSpan in 4/4', () => {
  it('writes a whole bar as a whole note, and a dotted half from its start', () => {
    expect(spell(0, 48)).toEqual([[0, 48, false]])
    expect(spell(0, 36)).toEqual([[0, 36, false]])
  })

  it('shows the middle of the bar: a half from beat 2 is two tied quarters', () => {
    expect(spell(12, 36)).toEqual([
      [12, 12, false],
      [24, 12, false],
    ])
  })

  it('keeps a dotted quarter on a beat', () => {
    expect(spell(0, 18)).toEqual([[0, 18, false]])
  })

  it('shows the beat: an 8th across it is two tied 8ths', () => {
    expect(spell(6, 18)).toEqual([
      [6, 6, false],
      [12, 6, false],
    ])
  })

  it('keeps 16th-8th-16th inside a beat', () => {
    expect(spell(3, 9)).toEqual([[3, 6, false]])
  })

  it('ties a 16th into a dotted 8th across a beat', () => {
    expect(spell(9, 21)).toEqual([
      [9, 3, false],
      [12, 9, false],
    ])
  })
})

describe('spellSpan in 3/4 and in eighths', () => {
  it('writes a half from beat 2 of 3/4', () => {
    expect(spell(12, 36, '3/4', [], 36)).toEqual([[12, 24, false]])
  })

  it('writes 6/8 in dotted values, quarters and 8ths', () => {
    expect(spell(0, 24, '6/8', [], 24)).toEqual([[0, 24, false]])
    expect(spell(0, 8, '6/8', [], 24)).toEqual([[0, 8, false]])
    expect(spell(4, 12, '6/8', [], 24)).toEqual([[4, 8, false]])
  })

  it('writes a 16th-grid figure in 12/8 in dotted 8ths, and ties across the middle', () => {
    expect(spell(18, 24, '12/8')).toEqual([[18, 6, false]])
    expect(spell(12, 36, '12/8')).toEqual([
      [12, 12, false],
      [24, 12, false],
    ])
  })
})

describe('triplet beats', () => {
  it('writes a swung pair as a triplet quarter and a triplet 8th', () => {
    expect(spell(0, 8, '4/4', [{ start: 8, end: 12 }])).toEqual([[0, 8, true]])
    expect(spell(8, 12, '4/4', [{ start: 0, end: 8 }])).toEqual([[8, 4, true]])
  })

  it('ties a triplet 8th into the next beat', () => {
    expect(spell(8, 24, '4/4', [{ start: 0, end: 8 }])).toEqual([
      [8, 4, true],
      [12, 12, false],
    ])
  })
})

describe('voiceGrid', () => {
  it('finds a voice’s triplet beats', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: 8 },
        { start: 8, end: 24 },
      ],
      '4/4',
    )
    expect(grid.isTriplet(4)).toBe(true)
    expect(grid.isTriplet(12)).toBe(false)
  })

  it('moves a beat’s boundaries on neither grid to the nearest 3 ticks', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: 5 },
        { start: 5, end: 12 },
      ],
      '4/4',
    )
    expect(grid.place(5)).toBe(6)
    expect(grid.place(12)).toBe(12)
    expect(grid.isTriplet(0)).toBe(false)
  })

  it('writes every tick of x/8 as it is', () => {
    const grid = voiceGrid([{ start: 0, end: 5 }], '6/8')
    expect(grid.place(5)).toBe(5)
    expect(grid.isTriplet(0)).toBe(false)
  })
})
