import {
  accompanimentOptions,
  BUILT_IN_PATTERNS,
  METHOD_PATTERNS,
  type PatternBook,
  type PatternChoice,
} from '@/entities/pattern'
import {
  chartOf,
  hasChartPlan,
  isDegreePiece,
  patternsOfPiece,
  pieceKey,
  stavesOf,
  type Piece,
} from '@/entities/piece'
import {
  arrange,
  isSimpleChart,
  simplifyChart,
  type ArrangeOptions,
  type Performance,
} from '@/shared/lib/arrangement'
import type { ChordSize } from '@/shared/lib/music'
import type { PracticeChoice } from './choice'

/** The chart's own plan when it has one (its methods, its sections' patterns), else the piece's pattern. */
export const defaultPattern = (piece: Piece): PatternChoice =>
  hasChartPlan(piece) ? 'chart' : piece.pattern

/**
 * The piece as written: its key, its default pattern and chord size, no figures swapped, its tune
 * unheard, its chords as written.
 */
export const ownChoice = (piece: Piece): PracticeChoice => ({
  tonic: pieceKey(piece).tonic,
  pattern: defaultPattern(piece),
  rh: null,
  lh: null,
  inversion: null,
  nearest: true,
  chordSize: null,
  tune: false,
  simple: false,
})

/**
 * A piece as the Player plays it: the learner's key, pattern, hands' figures, chord size and tune,
 * every chord its plain triad where Simplify is on (ADR 0104: a piece written in degrees then plays
 * triads whatever its chord size); its bars as written, or in the order they are played (`unfold`:
 * the repeats taken, the Player's).
 */
export function arrangePiece(
  piece: Piece,
  choice: PracticeChoice,
  book: PatternBook,
  { unfold = false }: { unfold?: boolean } = {},
): Performance {
  const chart = chartOf(piece, choice.chordSize ?? undefined)
  return arrange(choice.simple ? simplifyChart(chart) : chart, {
    ...arrangeOptions(piece, choice, book),
    ...(unfold ? { unfold } : {}),
  })
}

/**
 * Whether Simplify changes a piece (ADR 0104): a chord of its chart, at the chord size chosen (null
 * its own), that is not a plain triad on its root.
 */
export const simplifies = (piece: Piece, chordSize: ChordSize | null): boolean =>
  !isSimpleChart(chartOf(piece, chordSize ?? undefined))

/** The learner's choices as `arrange` takes them. */
function arrangeOptions(piece: Piece, choice: PracticeChoice, book: PatternBook): ArrangeOptions {
  const staves = stavesOf(piece)
  const fromChart = choice.pattern === 'chart'
  return {
    tonic: choice.tonic,
    tempo: piece.tempo,
    ...accompanimentOptions(
      book,
      {
        pattern: fromChart ? piece.pattern : choice.pattern,
        rh: choice.rh,
        lh: choice.lh,
        inversion: choice.inversion,
        nearest: choice.nearest,
      },
      fromChart ? [...patternsOfPiece(piece)] : undefined,
    ),
    ...(fromChart
      ? {
          methods: METHOD_PATTERNS,
          sections: isDegreePiece(piece)
            ? []
            : piece.sections.map((section) =>
                section.pattern ? BUILT_IN_PATTERNS.require(section.pattern).pattern : undefined,
              ),
        }
      : {}),
    ...(staves.length > 0 ? { staves, hearTune: choice.tune } : {}),
  }
}
