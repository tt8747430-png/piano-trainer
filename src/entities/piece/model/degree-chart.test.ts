import { describe, expect, it } from 'vitest'
import { PIECES } from '../content'
import { chartOf } from './chart'
import { asChartPiece } from './degree-chart'
import { definePiece, isDegreePiece, type DegreePiece } from './types'

const degree = (piece: Piece): DegreePiece => {
  if (!isDegreePiece(piece)) throw new Error('written in degrees')
  return piece
}
type Piece = Parameters<typeof isDegreePiece>[0]

const ONE_LINE = degree(
  definePiece({
    id: 'line',
    kind: 'song',
    title: 'Line',
    key: 'G',
    meter: '4/4',
    tempo: 80,
    pattern: 'r1',
    chordSize: { default: 'triads', choosable: true },
    progression: 'I:maj:4 IV:maj:2 V:dom:2 vi:min:4 V:dom:4 I:maj:8',
  }),
)

describe('asChartPiece', () => {
  it('writes a song in degrees as its chart in its key, at its own chord size', () => {
    const chart = asChartPiece(ONE_LINE)
    expect(chart).toMatchObject({ id: 'line', kind: 'song', key: 'G', meter: '4/4', tempo: 80 })
    expect(chart.sections).toEqual([{ kind: 'verse', lines: ['G C-D Em D', 'G G'] }])
    expect(chart).not.toHaveProperty('progression')
    expect(chart).not.toHaveProperty('chordSize')
  })

  it('keeps its sections’ headings, each line of the chart as written', () => {
    const sectioned = degree(
      definePiece({
        ...ONE_LINE,
        progression: [
          { kind: 'verse', lines: ['i:min:4'] },
          { kind: 'chorus', last: true, lines: ['V:dom:4/3 I:maj:4'] },
        ],
      }),
    )
    expect(asChartPiece(sectioned).sections).toEqual([
      { kind: 'verse', lines: ['Gm'] },
      { kind: 'chorus', last: true, lines: ['D/F# G'] },
    ])
  })

  it('plays the same chords as the piece in degrees, for every one in the catalog', () => {
    for (const piece of PIECES.filter(isDegreePiece)) {
      const written = chartOf(asChartPiece(piece))
      const read = chartOf(piece)
      expect(written.sections.map((s) => s.lines)).toEqual(read.sections.map((s) => s.lines))
    }
  })

  it('is the same object each time, so what is worked out from it holds', () => {
    expect(asChartPiece(ONE_LINE)).toBe(asChartPiece(ONE_LINE))
  })
})
