import {
  LEFT_FIGURES,
  METHOD_PATTERNS,
  PATTERNS,
  RIGHT_FIGURES,
  type PatternId,
} from '@/entities/pattern'
import { chartOf, hasMethodCodes, melodyOf, pieceKey, type Piece } from '@/entities/piece'
import { arrange, type Performance } from '@/shared/lib/arrangement'
import type { PracticeChoice } from './choice'

/** The chart's own methods when it names them, else the piece's pattern. */
export const defaultPattern = (piece: Piece): PatternId | 'chart' =>
  hasMethodCodes(piece) ? 'chart' : piece.pattern

/** The piece as written: its key, its default pattern and voicing, no figures swapped, no doubled melody. */
export const ownChoice = (piece: Piece): PracticeChoice => ({
  tonic: pieceKey(piece).tonic,
  pattern: defaultPattern(piece),
  rh: null,
  lh: null,
  voicing: null,
  melody: false,
})

/** A piece as the Player plays it: the learner's key, pattern, hands' figures, voicing and melody. */
export function arrangePiece(piece: Piece, choice: PracticeChoice): Performance {
  const melody = melodyOf(piece)
  const fromChart = choice.pattern === 'chart'
  return arrange(chartOf(piece, choice.voicing ?? undefined), {
    tonic: choice.tonic,
    pattern: PATTERNS[choice.pattern === 'chart' ? piece.pattern : choice.pattern].pattern,
    ...(fromChart ? { methods: METHOD_PATTERNS } : {}),
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
    ...(melody ? { melody, doubleMelody: choice.melody } : {}),
  })
}
