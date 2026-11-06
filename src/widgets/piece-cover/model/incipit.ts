import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { notate, type Score } from '@/shared/lib/notation'

/** The bars a cover shows: the opening, enough to know a song by. */
export const INCIPIT_BARS = 2

/**
 * A song's opening as its cover engraves it (R34, Piano Forte's covers): its first bars as written,
 * the tune's staff alone where it has one (else the right hand's), plain (no chord symbols, names or
 * tempo mark), so the cover is the music's own picture. A song with no notes yet engraves an empty
 * staff in its key and metre.
 */
export function incipitScore(piece: Piece, bars: number = INCIPIT_BARS): Score {
  const score = notate(arrangePiece(piece, { ...ownChoice(piece), tune: true }, BUILT_IN_PATTERNS))
  const staff = score.staves[0]
  return {
    ...score,
    plain: true,
    staves: staff ? [staff] : score.staves,
    measures: score.measures.slice(0, bars).map(({ tempo: _, ...measure }) => measure),
  }
}
