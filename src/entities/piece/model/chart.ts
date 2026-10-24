import { isMethodCode, METHODS, type PatternFit, type PatternId } from '@/entities/pattern'
import type { Chart, ChartChord, Melody } from '@/shared/lib/arrangement'
import { beatsToTicks, isCompound, type ChordSize, type Tick } from '@/shared/lib/music'
import { parseLyrics, tuneLength, withHandLyrics, withMelodyLyrics } from './lyrics'
import { parseChart } from './parse-chart'
import { parseMelody } from './parse-melody'
import { parseProgression } from './parse-progression'
import { isDegreePiece, type ChartPiece, type Piece } from './types'

/**
 * A piece's chart; one written in degrees at the chosen chord size when it lets the learner choose.
 * A piece without a melody sings its words on the right hand's notes (ADR 0093).
 */
export function chartOf(piece: Piece, chordSize?: ChordSize): Chart {
  if (isDegreePiece(piece)) {
    const { choosable, default: fixed } = piece.chordSize
    return parseProgression(piece, choosable ? (chordSize ?? fixed) : fixed)
  }
  const chart = parseChart(piece)
  if (piece.lyrics === undefined || piece.melody !== undefined) return chart
  return withHandLyrics(chart, parseLyrics(piece, tuneLength(chart, undefined)) ?? [])
}

/** A piece's tune, singing its words where it has them (ADR 0093). */
export function melodyOf(piece: Piece): Melody | undefined {
  if (isDegreePiece(piece)) return undefined
  const melody = parseMelody(piece)
  if (melody === undefined || piece.lyrics === undefined) return melody
  return withMelodyLyrics(melody, parseLyrics(piece, melody.length) ?? [])
}

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

/**
 * Whether the chart has a plan of its own for the Player to follow: a chord's playing technique (its
 * method code), or a section's own pattern.
 */
export const hasChartPlan = (piece: Piece): boolean =>
  !isDegreePiece(piece) &&
  (piece.sections.some((section) => section.pattern !== undefined) ||
    chordsOf(parseChart(piece)).some((chord) => chord.method))

/** What a piece has for a pattern: its chart's methods where it names them and the patterns they play, its tune where it has one, a key, and its meter. */
export const pieceFit = (piece: Piece): PatternFit => ({
  methodCodes: hasChartPlan(piece),
  ...(hasChartPlan(piece) ? { chart: [...patternsOfPiece(piece)] } : {}),
  melody: melodyOf(piece) !== undefined,
  key: true,
  simpleTime: !isCompound(piece.meter),
})

/**
 * The built-in patterns a piece plays: those its chart's methods name, and where a chord names none,
 * its section's own, else the piece's.
 */
export function patternsOfPiece(piece: Piece): ReadonlySet<PatternId> {
  if (isDegreePiece(piece)) return new Set([piece.pattern])
  const played = parseChart(piece).sections.flatMap((section, index) =>
    section.lines
      .flat()
      .flatMap((bar) => bar.chords)
      .map(({ method }) =>
        isMethodCode(method)
          ? METHODS[method].pattern
          : (piece.sections[index]?.pattern ?? piece.pattern),
      ),
  )
  return new Set(played)
}
