import type { FolderId, LibraryCatalog, LibraryStore } from '@/entities/library'
import * as edit from './model/layout-edits'

/**
 * A folder deleted, asked first (ADR 0106): an own folder goes for good, the learner's own songs in
 * it to the Trash (R34); a built-in folder goes to the archive whole with the app's songs in it, and
 * the app's songs in an own folder each to the archive, to be restored to its collection's folder.
 */
export function deleteFolder(store: LibraryStore, catalog: LibraryCatalog, id: FolderId): void {
  edit.editLibrary(store, catalog, (layout) => edit.dropFolder(layout, id, catalog))
}
