import { COLLECTIONS } from '../content'
import { isPiece, type Entry, type Piece } from './types'

const ENTRY_BY_ID = new Map(
  COLLECTIONS.flatMap((collection) => collection.entries).map((entry) => [entry.id, entry]),
)

export const entryById = (id: string): Entry | undefined => ENTRY_BY_ID.get(id)

/** The piece with this id; undefined for a listing, which never opens in the Player. */
export function pieceById(id: string): Piece | undefined {
  const entry = entryById(id)
  return entry && isPiece(entry) ? entry : undefined
}
