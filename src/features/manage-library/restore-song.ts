import type { LibraryCatalog, LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/** Songs out of the Trash back where each stood, while that folder is in the library; else at Home, last. */
export function restoreTrashed(
  store: LibraryStore,
  catalog: LibraryCatalog,
  ids: readonly PieceId[],
): void {
  edit.editLibrary(store, catalog, (layout) => edit.untrashSongs(layout, ids))
}
