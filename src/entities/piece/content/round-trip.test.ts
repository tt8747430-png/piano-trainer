import { describe, expect, it } from 'vitest'
import { parseChart } from '../model/parse-chart'
import { parseStaff } from '../model/parse-staff'
import { musicOf, withMusic } from '../model/music'
import { writeBar } from '../model/write-chart'
import { writeStaff } from '../model/write-staff'
import { PIECES } from './index'
import { isDegreePiece, type ChartPiece } from '../model/types'

const CHART_PIECES = PIECES.filter((piece): piece is ChartPiece => !isDegreePiece(piece))

describe('every chart piece, written back', () => {
  it.each(CHART_PIECES.map((piece) => [piece.id, piece] as const))(
    '%s reads back the same',
    (_id, piece) => {
      const chart = parseChart(piece)
      const bars = chart.sections.flatMap((section) => section.lines.flat())
      let tick = 0
      const placed = bars.map((bar) => {
        const startTick = tick
        tick += Math.round(bar.beats * 12)
        return { startTick, ticks: Math.round(bar.beats * 12) }
      })
      const staves = (piece.staves ?? []).map((_, place) => parseStaff(piece, place))
      const rewritten = withMusic(piece, {
        ...musicOf(piece),
        sections: piece.sections.map((section, s) => ({
          ...section,
          lines: (chart.sections[s]?.lines ?? []).map((line) =>
            line.map((written) => writeBar(written, chart.meter)).join(' '),
          ),
        })),
        ...(piece.staves
          ? {
              staves: piece.staves.map((staff, place) => ({
                ...staff,
                notes: writeStaff(staves[place] ?? [], placed),
              })),
            }
          : {}),
      })
      expect(parseChart(rewritten)).toEqual(chart)
      expect((rewritten.staves ?? []).map((_, place) => parseStaff(rewritten, place))).toEqual(
        staves,
      )
    },
  )
})
