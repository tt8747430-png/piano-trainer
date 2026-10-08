import type { MethodBookId } from '@/entities/book'
import { isPiece, type Collection, type Piece } from '../model/types'
import bozheSpasibo from './bozhe-spasibo'
import calledToPlay from './called-to-play'
import hymns from './hymns'
import other from './other'
import studies from './studies'

/** The collections Songs lists, in order. */
export const SONG_COLLECTIONS: readonly Collection[] = [bozheSpasibo, calledToPlay, hymns, other]

/**
 * The pieces a method book's patterns are practised on: Called to Play's lesson pieces, the studies, on
 * Practice (roadmap §3.9); for Боброва's seven types the hymns, songs that stay on Songs.
 */
export const METHOD_BOOK_PIECES: Readonly<Record<MethodBookId, Collection>> = {
  'called-to-play': studies,
  'seven-types': hymns,
}

/** Every collection, in `COLLECTION_IDS` order. */
export const COLLECTIONS: readonly Collection[] = [...SONG_COLLECTIONS, studies]

/** Every piece that opens in the Player, in catalog order. */
export const PIECES: readonly Piece[] = COLLECTIONS.flatMap(
  (collection) => collection.entries,
).filter(isPiece)
