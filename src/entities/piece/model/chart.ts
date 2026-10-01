import type { PatternFit } from '@/entities/pattern'
import type { Chart, ChartChord, Melody } from '@/shared/lib/arrangement'
import { isCompound, type ChordSize } from '@/shared/lib/music'
import { parseChart } from './parse-chart'
import { parseMelody } from './parse-melody'
import { parseProgression } from './parse-progression'
import type { Piece } from './types'

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

/** What a piece has for a pattern: its chart's methods where it names them, its tune where it has one, a key, and its meter. */
export const pieceFit = (piece: Piece): PatternFit => ({
  methodCodes: hasMethodCodes(piece),
  melody: melodyOf(piece) !== undefined,
  key: true,
  simpleTime: !isCompound(piece.meter),
})
