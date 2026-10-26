import type { FolderId, LibraryCatalog, LibraryStore } from '@/entities/library'
import * as edit from './model/layout-edits'

/** A folder, with its songs, out of the library into the archive (ADR 0106). */
export function archiveFolder(store: LibraryStore, catalog: LibraryCatalog, id: FolderId): void {
  edit.editLibrary(store, catalog, (layout) => edit.archiveFolder(layout, id))
}

/**
 * An archived folder back with its songs: at Home, last (Restore); or exactly where it stood
 * (`exact`, the toast's Undo).
 */
export function restoreFolder(
  store: LibraryStore,
  catalog: LibraryCatalog,
  id: FolderId,
  exact = false,
): void {
  edit.editLibrary(store, catalog, (layout) => edit.restoreFolder(layout, id, exact))
}
