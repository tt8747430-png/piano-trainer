import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells } from '@/features/practice'
import {
  beatAtMark,
  beatThrough,
  firstBeats,
  glide,
  stripDrawn,
  stripEnds,
  stripRelease,
  stripShift,
} from './strip-place'

const B = TICKS_PER_BEAT

const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['|: C G :| Am'] }],
}
const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
const bars = playedBeatCells(performance)

describe('beatThrough', () => {
  it('finds the beat along the strip a tick is in, and how far through it', () => {
    expect(firstBeats(bars)).toEqual([0, 4, 8, 12, 16])
    expect(beatThrough(performance, bars, 0)).toEqual({ cell: 0, through: 0 })
    expect(beatThrough(performance, bars, 1.5 * B)).toEqual({ cell: 1, through: 0.5 })
    // The repeat's second time, along the strip as played.
    expect(beatThrough(performance, bars, 2 * 4 * B + 0.25 * B)).toEqual({ cell: 8, through: 0.25 })
  })
})

describe('stripShift', () => {
  const lefts = [0, 50, 100, 152]
  const widths = [50, 50, 50, 50]

  it('stands the beat sounding’s middle a third of the way in as it starts', () => {
    expect(stripShift({ room: 300, lefts, widths, cell: 0, through: 0 })).toBe(75)
    expect(stripShift({ room: 300, lefts, widths, cell: 2, through: 0 })).toBe(-25)
  })

  it('slides on through the beat to the next’s place, over a barline’s width too', () => {
    expect(stripShift({ room: 300, lefts, widths, cell: 0, through: 0.5 })).toBe(50)
    expect(stripShift({ room: 300, lefts, widths, cell: 2, through: 0.5 })).toBe(-51)
    expect(stripShift({ room: 300, lefts, widths, cell: 3, through: 1 })).toBe(-127)
  })
})

describe('the strip dragged (ADR 0108)', () => {
  const lefts = [0, 50, 100, 152]
  const widths = [50, 50, 50, 50]
  const strip = { room: 300, lefts, widths }

  it('has its ends where its first and its last beat stand at the mark', () => {
    expect(stripEnds(strip)).toEqual({ first: 75, last: -77 })
  })

  it('follows the finger between its ends and gives like a rubber band past them', () => {
    const ends = stripEnds(strip)
    expect(stripDrawn(0, ends, 300)).toBe(0)
    const past = stripDrawn(75 + 60, ends, 300)
    expect(past).toBeGreaterThan(75)
    expect(past).toBeLessThan(75 + 60)
    expect(stripDrawn(-77 - 60, ends, 300)).toBeLessThan(-77)
    expect(stripDrawn(-77 - 60, ends, 300)).toBeGreaterThan(-77 - 60)
  })

  it('finds the beat whose middle is nearest the mark, a third of the way in', () => {
    expect(beatAtMark({ ...strip, shift: 75 })).toBe(0)
    expect(beatAtMark({ ...strip, shift: 51 })).toBe(0)
    expect(beatAtMark({ ...strip, shift: 49 })).toBe(1)
    expect(beatAtMark({ ...strip, shift: -25 })).toBe(2)
    // Past either end, its end's beat.
    expect(beatAtMark({ ...strip, shift: 400 })).toBe(0)
    expect(beatAtMark({ ...strip, shift: -900 })).toBe(3)
  })

  it('settles on the beat at the mark where it is let go, with no flick', () => {
    expect(stripRelease({ ...strip, shift: 30, velocity: 0, still: false })).toBe(1)
  })

  it('glides on with a flick, slowing, and settles on the beat at the mark where it comes to rest', () => {
    // Moving left at 0.2px a millisecond carries it 65px further on.
    expect(glide(-0.2)).toBeCloseTo(-65)
    expect(stripRelease({ ...strip, shift: 30, velocity: -0.2, still: false })).toBe(2)
    expect(stripRelease({ ...strip, shift: 30, velocity: 0.2, still: false })).toBe(0)
  })

  it('glides no further than its ends', () => {
    expect(stripRelease({ ...strip, shift: 0, velocity: -5, still: false })).toBe(3)
    expect(stripRelease({ ...strip, shift: 0, velocity: 5, still: false })).toBe(0)
  })

  it('under reduced motion glides nowhere: it snaps where it is let go', () => {
    expect(stripRelease({ ...strip, shift: 30, velocity: -5, still: true })).toBe(1)
  })
})
