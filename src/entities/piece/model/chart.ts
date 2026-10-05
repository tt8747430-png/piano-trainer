import { isMethodCode, METHODS, type PatternFit, type PatternId } from '@/entities/pattern'
import type { Chart, ChartChord, Melody } from '@/shared/lib/arrangement'
import { beatsToTicks, isCompound, type ChordSize, type Tick } from '@/shared/lib/music'
import { parseChart } from './parse-chart'
import { parseMelody } from './parse-melody'
import { parseProgression } from './parse-progression'
import { isDegreePiece, type ChartPiece, type Piece } from './types'

/** A piece's chart; one written in degrees at the chosen chord size when it lets the learner choose. */
export function chartOf(piece: Piece, chordSize?: ChordSize): Chart {
  if (!isDegreePiece(piece)) return parseChart(piece)
  const { choosable, default: fixed } = piece.chordSize
  return parseProgression(piece, choosable ? (chordSize ?? fixed) : fixed)
}

export const melodyOf = (piece: Piece): Melody | undefined =>
  isDegreePiece(piece) ? undefined : parseMelody(piece)

/** Every chord of a chart in order. */
export const chordsOf = (chart: Chart): ChartChord[] =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) => line.flatMap((bar) => bar.chords)),
  )

/** Each bar's length in a song's or study's chart, in order. */
export const barTicksOf = (piece: ChartPiece): Tick[] =>
  parseChart(piece).sections.flatMap((section) =>
    section.lines.flatMap((line) => line.map((bar) => beatsToTicks(bar.beats))),
  )

/** Whether the chart names its own playing techniques, so the Player can follow them. */
export const hasMethodCodes = (piece: Piece): boolean =>
  !isDegreePiece(piece) && chordsOf(parseChart(piece)).some((chord) => chord.method)

/** What a piece has for a pattern: its chart's methods where it names them, its tune where it has one, a key, and its meter. */
export const pieceFit = (piece: Piece): PatternFit => ({
  methodCodes: hasMethodCodes(piece),
  melody: melodyOf(piece) !== undefined,
  key: true,
  simpleTime: !isCompound(piece.meter),
})

/** The built-in patterns a piece plays: its own, and those its chart's methods name. */
export function patternsOfPiece(piece: Piece): ReadonlySet<PatternId> {
  const methods = isDegreePiece(piece)
    ? []
    : chordsOf(parseChart(piece)).flatMap((chord) =>
        isMethodCode(chord.method) ? [METHODS[chord.method].pattern] : [],
      )
  return new Set([piece.pattern, ...methods])
}
