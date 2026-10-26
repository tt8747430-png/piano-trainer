import { isMethodCode, METHODS, type PatternFit, type PatternId } from '@/entities/pattern'
import type { Chart, ChartChord, StaffMusic } from '@/shared/lib/arrangement'
import { beatsToTicks, isCompound, type ChordSize, type Tick } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { parseLyrics, tuneLength, withHandLyrics, withStaffLyrics } from './lyrics'
import { parseChart } from './parse-chart'
import { parseProgression } from './parse-progression'
import { parseStaff } from './parse-staff'
import { isDegreePiece, lyricsStaff, type ChartPiece, type Piece } from './types'

/**
 * A piece's chart; one written in degrees at the chosen chord size when it lets the learner choose.
 * Lyrics on the upper staff (`lyricsStaff`) are sung on the right hand's notes (ADR 0093).
 */
export function chartOf(piece: Piece, chordSize?: ChordSize): Chart {
  if (isDegreePiece(piece)) {
    const { choosable, default: fixed } = piece.chordSize
    return parseProgression(piece, choosable ? (chordSize ?? fixed) : fixed)
  }
  const chart = parseChart(piece)
  if (piece.lyrics === undefined || lyricsStaff(piece) !== 'rh') return chart
  return withHandLyrics(chart, parseLyrics(piece, tuneLength(chart, undefined)) ?? [])
}

/**
 * A piece's single staves over the piano, top down (ADR 0097): each its clef and its notes, the
 * staff its words are on singing them (ADR 0093). Words on a staff the piece has not are the
 * content's mistake: a ContentError names it.
 */
export function stavesOf(piece: Piece): StaffMusic[] {
  if (isDegreePiece(piece)) return []
  const written = piece.staves ?? []
  const on = lyricsStaff(piece)
  if (piece.lyrics !== undefined && typeof on === 'number' && written[on] === undefined)
    throw new ContentError(piece.id, {}, `the lyrics are on staff ${on + 1}, which it has not`)
  return written.map((staff, place) => {
    const notes = parseStaff(piece, place)
    const sung = piece.lyrics !== undefined && on === place
    return {
      clef: staff.clef ?? 'treble',
      notes: sung ? withStaffLyrics(notes, parseLyrics(piece, notes.length) ?? []) : notes,
    }
  })
}

/** How many sections a piece's chart has: a progression written in one line is one. */
export function sectionCount(piece: Piece): number {
  if (!isDegreePiece(piece)) return piece.sections.length
  return typeof piece.progression === 'string' ? 1 : piece.progression.length
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
  tune: stavesOf(piece).length > 0,
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
