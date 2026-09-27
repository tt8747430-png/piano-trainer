import { isPiece, type Collection, type Piece } from '../model/types'
import bozheSpasibo from './bozhe-spasibo'
import calledToPlay from './called-to-play'
import hymns from './hymns'
import progressions from './progressions'
import studies from './studies'

export { BOOKS } from './books'
export { COMMON_PROGRESSIONS } from './progressions'

/** The collections Songs lists, in order. */
export const SONG_COLLECTIONS: readonly Collection[] = [bozheSpasibo, calledToPlay, hymns]

/** The method books' lesson pieces, on Practice (roadmap §3.9). */
export const STUDIES: Collection = studies

/** Progressions in one key, on Practice (roadmap §3.9). */
export const PROGRESSIONS: Collection = progressions

/** Every collection, in `COLLECTION_IDS` order. */
export const COLLECTIONS: readonly Collection[] = [...SONG_COLLECTIONS, STUDIES, PROGRESSIONS]

/** Every piece that opens in the Player, in catalog order. */
export const PIECES: readonly Piece[] = COLLECTIONS.flatMap(
  (collection) => collection.entries,
).filter(isPiece)
