import { pitchClassOf, type ChordSize, type Key, type SpelledNote } from '@/shared/lib/music'
import type { PatternId } from '@/entities/pattern'
import { COLLECTIONS, PIECES } from '../content'
import { patternsOfPiece } from './chart'
import { isPiece, pieceKey, type Entry, type Piece } from './types'

const ENTRY_BY_ID = new Map(
  COLLECTIONS.flatMap((collection) => collection.entries).map((entry) => [entry.id, entry]),
)

export const entryById = (id: string): Entry | undefined => ENTRY_BY_ID.get(id)

/** The piece with this id; undefined for a listing, which never opens in the Player. */
export function pieceById(id: string): Piece | undefined {
  const entry = entryById(id)
  return entry && isPiece(entry) ? entry : undefined
}

/** A progression's own chord size where the learner may change it (the Player's Setup); else null. */
export const choosableChordSize = (piece: Piece): ChordSize | null =>
  piece.kind === 'progression' && piece.chordSize.choosable ? piece.chordSize.default : null

/** Whether `tonic` is the piece's own key's, however spelled: its recording plays along only there. */
export const isOwnKey = (piece: Piece, tonic: SpelledNote): boolean =>
  pitchClassOf(tonic) === pitchClassOf(pieceKey(piece).tonic)

/** The songs, listings and studies written in a key, in catalog order (a progression is practised in any key). */
export function entriesInKey(key: Key): Entry[] {
  const tonic = pitchClassOf(key.tonic)
  return [...ENTRY_BY_ID.values()].filter((entry) => {
    const own = pieceKey(entry)
    return (
      entry.kind !== 'progression' && own.minor === key.minor && pitchClassOf(own.tonic) === tonic
    )
  })
}

const PLAYING = new Map<PatternId, readonly Piece[]>()

/** The songs, studies and progressions that play a built-in pattern, in catalogue order. */
export function piecesPlaying(pattern: PatternId): readonly Piece[] {
  const known = PLAYING.get(pattern)
  if (known) return known
  const pieces = PIECES.filter((piece) => patternsOfPiece(piece).has(pattern))
  PLAYING.set(pattern, pieces)
  return pieces
}
