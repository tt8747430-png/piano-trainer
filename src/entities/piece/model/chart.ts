import type { Chart, ChartChord, Melody } from '@/shared/lib/arrangement'
import { parseChart } from './parse-chart'
import { parseMelody } from './parse-melody'
import { parseProgression } from './parse-progression'
import type { ChordSize, Piece } from './types'

/** A piece's chart; a progression at the chosen chord size when it lets the learner choose. */
export function chartOf(piece: Piece, chordSize?: ChordSize): Chart {
  if (piece.kind !== 'progression') return parseChart(piece)
  const { choosable, default: fixed } = piece.chordSize
  return parseProgression(piece, choosable ? (chordSize ?? fixed) : fixed)
}

export const melodyOf = (piece: Piece): Melody | undefined =>
  piece.kind === 'progression' ? undefined : parseMelody(piece)

/** Every chord of a chart in order. */
export const chordsOf = (chart: Chart): ChartChord[] =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) => line.flatMap((bar) => bar.chords)),
  )

/** Whether the chart names its own playing techniques, so the Player can follow them. */
export const hasMethodCodes = (piece: Piece): boolean =>
  piece.kind !== 'progression' && chordsOf(parseChart(piece)).some((chord) => chord.method)
