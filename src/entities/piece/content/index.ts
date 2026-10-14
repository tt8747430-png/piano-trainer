import type { MethodBookId } from '@/entities/book'
import { isPiece, type Collection, type Piece } from '../model/types'
import bozheSpasibo from './bozhe-spasibo'
import calledToPlay from './called-to-play'
import calledToPlayTwo from './called-to-play-2'
import gorshkov from './gorshkov'
import hymns from './hymns'
import studies from './studies'

/** The collections Songs lists, in order. */
export const SONG_COLLECTIONS: readonly Collection[] = [
  bozheSpasibo,
  calledToPlay,
  calledToPlayTwo,
  hymns,
  gorshkov,
]

/**
 * The pieces a method book's patterns are practised on: Called to Play's lesson pieces, the studies, on
 * Practice (roadmap §3.9); for its level 2 that workbook's songs, for Боброва's seven types the hymns,
 * and for Gorshkov's course its songs: songs that stay on Songs.
 */
export const METHOD_BOOK_PIECES: Readonly<Record<MethodBookId, Collection>> = {
  'called-to-play': studies,
  'called-to-play-2': calledToPlayTwo,
  'seven-types': hymns,
  gorshkov,
}

/** Every collection, in `COLLECTION_IDS` order. */
export const COLLECTIONS: readonly Collection[] = [...SONG_COLLECTIONS, studies]

/** Every piece that opens in the Player, in catalog order. */
export const PIECES: readonly Piece[] = COLLECTIONS.flatMap(
  (collection) => collection.entries,
).filter(isPiece)
