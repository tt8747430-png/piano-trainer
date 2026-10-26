import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells } from '@/features/practice'
import { beatThrough, firstBeats, stripShift } from './strip-place'

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
    expect(beatThrough(performance, bars, 36)).toEqual({ cell: 1, through: 0.5 })
    // The repeat's second time, along the strip as played.
    expect(beatThrough(performance, bars, 2 * 96 + 6)).toEqual({ cell: 8, through: 0.25 })
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
