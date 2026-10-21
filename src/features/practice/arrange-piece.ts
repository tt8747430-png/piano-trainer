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
  melodyOf,
  patternsOfPiece,
  pieceKey,
  voicesOf,
  type Piece,
} from '@/entities/piece'
import { arrange, type ArrangeOptions, type Performance } from '@/shared/lib/arrangement'
import type { PracticeChoice } from './choice'

/** The chart's own plan when it has one (its methods, its sections' patterns), else the piece's pattern. */
export const defaultPattern = (piece: Piece): PatternChoice =>
  hasChartPlan(piece) ? 'chart' : piece.pattern

/** The piece as written: its key, its default pattern and chord size, no figures swapped, no doubled melody. */
export const ownChoice = (piece: Piece): PracticeChoice => ({
  tonic: pieceKey(piece).tonic,
  pattern: defaultPattern(piece),
  rh: null,
  lh: null,
  inversion: null,
  nearest: true,
  chordSize: null,
  melody: false,
})

/**
 * A piece as the Player plays it: the learner's key, pattern, hands' figures, chord size and melody.
 */
export function arrangePiece(piece: Piece, choice: PracticeChoice, book: PatternBook): Performance {
  return arrange(chartOf(piece, choice.chordSize ?? undefined), arrangeOptions(piece, choice, book))
}

/** The learner's choices as `arrange` takes them. */
function arrangeOptions(piece: Piece, choice: PracticeChoice, book: PatternBook): ArrangeOptions {
  const melody = melodyOf(piece)
  const voices = voicesOf(piece)
  const fromChart = choice.pattern === 'chart'
  return {
    tonic: choice.tonic,
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
    ...(melody ? { melody, doubleMelody: choice.melody } : {}),
    ...(voices.length > 0 ? { voices } : {}),
  }
}
