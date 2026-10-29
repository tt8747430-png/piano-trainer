import { isSongCollectionId, songCollections, type PieceId } from '@/entities/piece'
import type { LibraryCatalog } from './arrangement'

/**
 * The collections' songs, in catalog order, each collection a folder from the start (ADR 0106); the
 * songs editors made at their collections' ends.
 */
const collections = (): LibraryCatalog['collections'] =>
  songCollections().flatMap(({ id, entries }) =>
    isSongCollectionId(id) ? [{ id, songs: entries.map((entry) => entry.id) }] : [],
  )

/** What the library is read over: the collections, and the learner's own songs (the repertoire's, or the store's). */
export const libraryCatalog = (own: {
  readonly ownSongs: readonly { readonly id: PieceId }[]
}): LibraryCatalog => ({
  collections: collections(),
  ownSongs: own.ownSongs.map((song) => song.id),
})
