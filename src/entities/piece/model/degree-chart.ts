import { chartOf } from './chart'
import { writeBar } from './write-chart'
import type { ChartPiece, DegreePiece, Section } from './types'

const charts = new WeakMap<DegreePiece, ChartPiece>()

/**
 * A song written in degrees as a chart in its key (ADR 0110): its chords read at its own chord size,
 * as the Player plays them, each bar written as a chart writes it, under its sections' headings (one
 * line of degrees a verse). What a learner's version of it starts from, so it is edited as any song.
 */
export function asChartPiece(piece: DegreePiece): ChartPiece {
  const known = charts.get(piece)
  if (known) return known
  const { progression, chordSize: _size, ...common } = piece
  const headings: readonly Omit<Section, 'lines'>[] =
    typeof progression === 'string'
      ? [{ kind: 'verse' }]
      : progression.map(({ lines: _lines, ...heading }) => heading)
  const chart = chartOf(piece)
  const written: ChartPiece = {
    ...common,
    sections: chart.sections.map((section, s) => ({
      ...(headings[s] ?? { kind: 'verse' }),
      lines: section.lines.map((line) => line.map((bar) => writeBar(bar, piece.meter)).join(' ')),
    })),
  }
  charts.set(piece, written)
  return written
}
