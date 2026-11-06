import type { LibraryCatalog, LibraryStore } from '@/entities/library'
import { isOwnSongId, type OwnSongId, type PieceId, type PiecesStore } from '@/entities/piece'
import type { TakesStore } from '@/entities/take'
import { deleteSong } from '@/features/edit-piece'
import * as edit from './model/layout-edits'

/** The stores a deletion for good reaches: the library, and the learner's songs with their takes. */
export interface DeletingStores {
  readonly library: LibraryStore
  readonly pieces: PiecesStore
  readonly takes: TakesStore
}

/**
 * Songs in the Trash deleted for good, asked first (R34): these, or the whole Trash emptied; each with
 * its takes, out of every list and the favourites.
 */
export function emptyTrash(
  { library, pieces, takes }: DeletingStores,
  catalog: LibraryCatalog,
  ids?: readonly PieceId[],
): void {
  const trashed = library.getState().trash.map((entry) => entry.id)
  const gone = (ids ?? trashed).filter(
    (id): id is OwnSongId => trashed.includes(id) && isOwnSongId(id),
  )
  const goneIds = new Set<PieceId>(gone)
  edit.editLibrary(library, catalog, (layout) => edit.dropSongs(layout, gone))
  library.setState(({ favourites }) => ({
    favourites: favourites.filter((id) => !goneIds.has(id)),
  }))
  for (const id of gone) deleteSong(pieces, takes, id)
}
