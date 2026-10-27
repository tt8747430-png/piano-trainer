import type { PieceId } from '@/entities/piece'
import type { Inversion } from '@/shared/lib/music'

/**
 * The inversion chosen for each chord of a piece, by its symbol as played (ADR 0108): what its
 * diagrams draw it in, wherever the piece shows them. The chord chosen last at the end.
 */
export type ChosenInversions = Readonly<Record<string, Inversion>>

/** Each piece's chosen inversions, by its id: the piece chosen in last at the end. */
export type PieceInversions = Readonly<Record<PieceId, ChosenInversions>>

/** The most pieces kept: those chosen in last. */
export const MOST_PIECES = 200
/** The most chords kept a piece: those chosen last, more than a song played in every key has. */
export const MOST_CHORDS = 100

/** The latest `most` of entries in the order made, as a record. */
const latest = <T>(entries: Iterable<readonly [string, T]>, most: number): Record<string, T> =>
  Object.fromEntries([...entries].slice(-most))

/** Pieces in the order chosen in, each its latest chords, the oldest past the caps forgotten. */
export const latestPieces = (
  pieces: Iterable<readonly [PieceId, ChosenInversions]>,
): PieceInversions =>
  latest(
    [...pieces].map(
      ([pieceId, chosen]) => [pieceId, latest(Object.entries(chosen), MOST_CHORDS)] as const,
    ),
    MOST_PIECES,
  )

/**
 * A piece's chord drawn in an inversion from now on, as chosen last and the piece as chosen in
 * last; `null` forgets the choice, and a piece with none left.
 */
export function withChosen(
  pieces: PieceInversions,
  pieceId: PieceId,
  symbol: string,
  inversion: Inversion | null,
): PieceInversions {
  const others = Object.entries(pieces[pieceId] ?? {}).filter(([chord]) => chord !== symbol)
  const chords = inversion === null ? others : [...others, [symbol, inversion] as const]
  const rest = Object.entries(pieces).filter(([other]) => other !== pieceId)
  return latestPieces(
    chords.length === 0 ? rest : [...rest, [pieceId, Object.fromEntries(chords)] as const],
  )
}
