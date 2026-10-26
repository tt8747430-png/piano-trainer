import type { FolderId, LibraryCatalog, LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/** The folders in the order they were dropped in on screen (Manual), the rest in theirs. */
export function orderFolders(
  store: LibraryStore,
  catalog: LibraryCatalog,
  order: readonly FolderId[],
): void {
  edit.editLibrary(store, catalog, (layout) => edit.orderFolders(layout, order))
}

/** A folder's songs, or Home's (`null`), in the order they were dropped in on screen (Manual). */
export function orderSongs(
  store: LibraryStore,
  catalog: LibraryCatalog,
  folder: FolderId | null,
  order: readonly PieceId[],
): void {
  edit.editLibrary(store, catalog, (layout) => edit.orderSongs(layout, folder, order))
}
