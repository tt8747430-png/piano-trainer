import { isPiece, type Collection, type Piece } from '../model/types'
import bozheSpasibo from './bozhe-spasibo'
import calledToPlay from './called-to-play'
import hymns from './hymns'
import other from './other'
import studies from './studies'

/** The collections Songs lists, in order. */
export const SONG_COLLECTIONS: readonly Collection[] = [bozheSpasibo, calledToPlay, hymns, other]

/** The method books' lesson pieces, on Practice (roadmap §3.9). */
export const STUDIES: Collection = studies

/** Every collection, in `COLLECTION_IDS` order. */
export const COLLECTIONS: readonly Collection[] = [...SONG_COLLECTIONS, STUDIES]

/** Every piece that opens in the Player, in catalog order. */
export const PIECES: readonly Piece[] = COLLECTIONS.flatMap(
  (collection) => collection.entries,
).filter(isPiece)
