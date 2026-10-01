import { describe, expect, it } from 'vitest'
import { parseChart } from '../model/parse-chart'
import { parseMelody } from '../model/parse-melody'
import { musicOf, withMusic } from '../model/music'
import { writeBar } from '../model/write-chart'
import { writeMelody } from '../model/write-melody'
import { PIECES } from './index'
import type { ChartPiece } from '../model/types'

const CHART_PIECES = PIECES.filter((piece): piece is ChartPiece => piece.kind !== 'progression')

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
      const melody = parseMelody(piece)
      const rewritten = withMusic(piece, {
        ...musicOf(piece),
        sections: piece.sections.map((section, s) => ({
          ...section,
          lines: (chart.sections[s]?.lines ?? []).map((line) =>
            line.map((written) => writeBar(written, chart.meter)).join(' '),
          ),
        })),
        ...(melody ? { melody: writeMelody(melody, placed) } : {}),
      })
      expect(parseChart(rewritten)).toEqual(chart)
      expect(parseMelody(rewritten)).toEqual(melody)
    },
  )
})
