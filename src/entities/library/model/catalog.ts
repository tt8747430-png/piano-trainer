import { isSongCollectionId, SONG_COLLECTIONS, type PieceId } from '@/entities/piece'
import type { LibraryCatalog } from './arrangement'

/** The collections' songs, in catalog order: each collection a folder from the start (ADR 0106). */
const COLLECTIONS: LibraryCatalog['collections'] = SONG_COLLECTIONS.flatMap(({ id, entries }) =>
  isSongCollectionId(id) ? [{ id, songs: entries.map((entry) => entry.id) }] : [],
)

/** What the library is read over: the collections, and the learner's own songs (the repertoire's, or the store's). */
export const libraryCatalog = (own: {
  readonly ownSongs: readonly { readonly id: PieceId }[]
}): LibraryCatalog => ({
  collections: COLLECTIONS,
  ownSongs: own.ownSongs.map((song) => song.id),
})
