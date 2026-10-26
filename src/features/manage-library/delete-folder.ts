import type { FolderId, LibraryCatalog, LibraryStore } from '@/entities/library'
import { isOwnSongId, type OwnSongId, type PiecesStore } from '@/entities/piece'
import type { TakesStore } from '@/entities/take'
import { deleteSong } from '@/features/edit-piece'
import * as edit from './model/layout-edits'

/** The stores a deletion reaches: the library, and the learner's songs with their takes. */
export interface DeletingStores {
  readonly library: LibraryStore
  readonly pieces: PiecesStore
  readonly takes: TakesStore
}

/**
 * A folder deleted, asked first (ADR 0106): the learner's own songs in it go for good with their
 * takes; the app's go to the archive, a built-in folder whole with them, each from an own folder on
 * its own, to be restored to its collection's folder; an own folder goes for good.
 */
export function deleteFolder(
  { library, pieces, takes }: DeletingStores,
  catalog: LibraryCatalog,
  id: FolderId,
): void {
  let gone: OwnSongId[] = []
  edit.editLibrary(library, catalog, (layout) => {
    const dropped = edit.dropFolder(layout, id, catalog)
    gone = dropped.ownSongs.filter(isOwnSongId)
    return dropped.layout
  })
  const goneIds = new Set<string>(gone)
  library.setState(({ favourites }) => ({
    favourites: favourites.filter((each) => !goneIds.has(each)),
  }))
  for (const song of gone) deleteSong(pieces, takes, song)
}
