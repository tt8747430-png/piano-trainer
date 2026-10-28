import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT, type Meter } from '@/shared/lib/music'
import { spellSpan, voiceGrid, type Span } from './rhythm'
import { ticksOf } from './values'

const B = TICKS_PER_BEAT

/**
 * A span spelled among its voice's other spans, all in beats: each piece's start, its length and
 * its tuplet's count (0 for none).
 */
function spell(start: number, end: number, meter: Meter = '4/4', others: Span[] = [], bar = 4) {
  const ticks = (span: Span) => ({
    start: Math.round(span.start * B),
    end: Math.round(span.end * B),
  })
  const grid = voiceGrid([ticks({ start, end }), ...others.map(ticks)], meter, bar * B)
  return spellSpan(ticks({ start, end }), { meter, barTicks: bar * B, grid }).map(
    ({ tick, duration }) => [tick / B, ticksOf(duration, meter) / B, duration.tuplet?.num ?? 0],
  )
}

/** Spans end to end from 0, of these lengths in beats. */
function line(...lengths: number[]): Span[] {
  let at = 0
  return lengths.map((length) => {
    const span = { start: at, end: at + length }
    at += length
    return span
  })
}

describe('spellSpan in 4/4', () => {
  it('writes a whole bar as a whole note, and a dotted half from its start', () => {
    expect(spell(0, 4)).toEqual([[0, 4, 0]])
    expect(spell(0, 3)).toEqual([[0, 3, 0]])
  })

  it('shows the middle of the bar: a half from beat 2 is two tied quarters', () => {
    expect(spell(1, 3)).toEqual([
      [1, 1, 0],
      [2, 1, 0],
    ])
  })

  it('keeps a dotted quarter on a beat', () => {
    expect(spell(0, 1.5)).toEqual([[0, 1.5, 0]])
  })

  it('shows the beat: an 8th across it is two tied 8ths', () => {
    expect(spell(0.5, 1.5)).toEqual([
      [0.5, 0.5, 0],
      [1, 0.5, 0],
    ])
  })

  it('keeps 16th-8th-16th inside a beat', () => {
    expect(spell(0.25, 0.75)).toEqual([[0.25, 0.5, 0]])
  })

  it('ties a 16th into a dotted 8th across a beat', () => {
    expect(spell(0.75, 1.75)).toEqual([
      [0.75, 0.25, 0],
      [1, 0.75, 0],
    ])
  })

  it('writes a 64th as it is', () => {
    expect(spell(0.0625, 0.125, '4/4', line(0.0625))).toEqual([[0.0625, 0.0625, 0]])
  })
})

describe('spellSpan in 3/4 and in eighths', () => {
  it('writes a half from beat 2 of 3/4', () => {
    expect(spell(1, 3, '3/4', [], 3)).toEqual([[1, 2, 0]])
  })

  it('writes 6/8 in dotted values, quarters and 8ths', () => {
    expect(spell(0, 2, '6/8', [], 2)).toEqual([[0, 2, 0]])
    expect(spell(0, 2 / 3, '6/8', [], 2)).toEqual([[0, 2 / 3, 0]])
    expect(spell(1 / 3, 1, '6/8', [], 2)).toEqual([[1 / 3, 2 / 3, 0]])
  })

  it('writes a 16th-grid figure in 12/8 in dotted 8ths, and ties across the middle', () => {
    expect(spell(1.5, 2, '12/8')).toEqual([[1.5, 0.5, 0]])
    expect(spell(1, 3, '12/8')).toEqual([
      [1, 1, 0],
      [2, 1, 0],
    ])
  })
})

describe('tuplets', () => {
  it('writes a swung pair as a triplet quarter and a triplet 8th', () => {
    expect(spell(0, 2 / 3, '4/4', [{ start: 2 / 3, end: 1 }])).toEqual([[0, 2 / 3, 3]])
    expect(spell(2 / 3, 1, '4/4', [{ start: 0, end: 2 / 3 }])).toEqual([[2 / 3, 1 / 3, 3]])
  })

  it('ties a triplet 8th into the next beat', () => {
    expect(
      spell(2 / 3, 2, '4/4', [
        { start: 0, end: 2 / 3 },
        { start: 2, end: 3 },
      ]),
    ).toEqual([[2 / 3, 4 / 3, 3]])
    expect(
      spell(2 / 3, 1.5, '4/4', [
        { start: 0, end: 2 / 3 },
        { start: 1.5, end: 2 },
      ]),
    ).toEqual([
      [2 / 3, 1 / 3, 3],
      [1, 0.5, 0],
    ])
  })

  it('writes triplet quarters over two beats as one triplet, none tied', () => {
    const quarters = line(2 / 3, 2 / 3, 2 / 3)
    expect(spell(2 / 3, 4 / 3, '4/4', quarters)).toEqual([[2 / 3, 2 / 3, 3]])
  })

  it('writes five, six, seven and nine to a beat as their tuplets', () => {
    expect(spell(0.2, 0.4, '4/4', line(0.2, 0.2, 0.2, 0.2, 0.2))).toEqual([[0.2, 0.2, 5]])
    expect(spell(1 / 6, 2 / 6, '4/4', line(...Array<number>(6).fill(1 / 6)))).toEqual([
      [1 / 6, 1 / 6, 6],
    ])
    expect(spell(1 / 7, 2 / 7, '4/4', line(...Array<number>(7).fill(1 / 7)))).toEqual([
      [1 / 7, 1 / 7, 7],
    ])
    expect(spell(1 / 9, 2 / 9, '4/4', line(...Array<number>(9).fill(1 / 9)))).toEqual([
      [1 / 9, 1 / 9, 9],
    ])
  })

  it('writes a triplet 8th and two triplet 16ths as one triplet, not a sextuplet', () => {
    expect(spell(1 / 3, 1 / 2, '4/4', line(1 / 3, 1 / 6, 1 / 6))).toEqual([[1 / 3, 1 / 6, 3]])
  })

  it('writes quintuplet 8ths over two beats', () => {
    expect(spell(0.4, 0.8, '4/4', line(0.4, 0.4, 0.4, 0.4, 0.4))).toEqual([[0.4, 0.4, 5]])
  })

  it('writes a duplet and a quadruplet in compound time', () => {
    expect(spell(0, 0.5, '6/8', line(0.5, 0.5), 2)).toEqual([[0, 0.5, 2]])
    expect(spell(0.25, 0.5, '6/8', line(0.25, 0.25, 0.25, 0.25), 2)).toEqual([[0.25, 0.25, 4]])
  })

  it('rests out a tuplet’s gaps in its own values', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: B / 5 },
        { start: (3 * B) / 5, end: (4 * B) / 5 },
      ],
      '4/4',
      4 * B,
    )
    const rest = spellSpan(
      { start: B / 5, end: (3 * B) / 5 },
      { meter: '4/4', barTicks: 4 * B, grid },
    )
    expect(rest.map(({ duration }) => duration.tuplet?.num)).toEqual([5])
    expect(rest.map(({ duration }) => ticksOf(duration, '4/4'))).toEqual([(2 * B) / 5])
  })
})

describe('voiceGrid', () => {
  it('finds a voice’s tuplets: where each starts and ends, and its count', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: (2 * B) / 3 },
        { start: (2 * B) / 3, end: B },
        { start: B, end: 2 * B },
      ],
      '4/4',
      4 * B,
    )
    expect(grid.tupletAt(B / 3)).toEqual({ start: 0, end: B, tuplet: { num: 3, numbase: 2 } })
    expect(grid.tupletAt(B)).toBeNull()
    expect(grid.nextTuplet(0)).toBeNull()
  })

  it('writes a beat of 64ths as it is', () => {
    const grid = voiceGrid(
      Array.from({ length: 16 }, (_, k) => ({ start: (k * B) / 16, end: ((k + 1) * B) / 16 })),
      '4/4',
      4 * B,
    )
    expect(grid.tupletAt(0)).toBeNull()
    expect(grid.place((3 * B) / 16)).toBe((3 * B) / 16)
  })

  it('moves boundaries no value or tuplet writes to the nearest 64th', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: 5 },
        { start: 5, end: B },
      ],
      '4/4',
      4 * B,
    )
    expect(grid.place(5)).toBe(0)
    expect(grid.place(B / 16 - 5)).toBe(B / 16)
    expect(grid.place(B)).toBe(B)
    expect(grid.tupletAt(0)).toBeNull()
  })

  it('moves a compound beat’s stray boundaries to its 64ths as well', () => {
    const grid = voiceGrid([{ start: 0, end: 5 }], '6/8', 2 * B)
    expect(grid.place(5)).toBe(0)
  })
})
