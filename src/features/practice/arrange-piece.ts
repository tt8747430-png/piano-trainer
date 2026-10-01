import { accompanimentOptions, METHOD_PATTERNS, type PatternChoice } from '@/entities/pattern'
import { chartOf, hasMethodCodes, melodyOf, pieceKey, type Piece } from '@/entities/piece'
import { arrange, type Performance } from '@/shared/lib/arrangement'
import type { PracticeChoice } from './choice'

/** The chart's own methods when it names them, else the piece's pattern. */
export const defaultPattern = (piece: Piece): PatternChoice =>
  hasMethodCodes(piece) ? 'chart' : piece.pattern

/** The piece as written: its key, its default pattern and chord size, no figures swapped, no doubled melody. */
export const ownChoice = (piece: Piece): PracticeChoice => ({
  tonic: pieceKey(piece).tonic,
  pattern: defaultPattern(piece),
  rh: null,
  lh: null,
  chordSize: null,
  melody: false,
})

/** A piece as the Player plays it: the learner's key, pattern, hands' figures, chord size and melody. */
export function arrangePiece(piece: Piece, choice: PracticeChoice): Performance {
  const melody = melodyOf(piece)
  const fromChart = choice.pattern === 'chart'
  return arrange(chartOf(piece, choice.chordSize ?? undefined), {
    tonic: choice.tonic,
    ...accompanimentOptions({
      pattern: fromChart ? piece.pattern : choice.pattern,
      rh: choice.rh,
      lh: choice.lh,
    }),
    ...(fromChart ? { methods: METHOD_PATTERNS } : {}),
    ...(melody ? { melody, doubleMelody: choice.melody } : {}),
  })
}
