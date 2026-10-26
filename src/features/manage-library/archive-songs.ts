import type { LibraryCatalog, LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/**
 * Songs out of the library into the archive (ADR 0106), each saying where it stood: returns those
 * archived, for the toast's Undo, which is their Restore (`restoreSongs`).
 */
export function archiveSongs(
  store: LibraryStore,
  catalog: LibraryCatalog,
  ids: readonly PieceId[],
): PieceId[] {
  let archived: PieceId[] = []
  edit.editLibrary(store, catalog, (layout) => {
    archived = edit.placesOf(layout, ids).map((each) => each.id)
    return edit.archiveSongs(layout, archived)
  })
  return archived
}

/** Archived songs back where each stood, while that folder is in the library; else at Home, last. */
export function restoreSongs(
  store: LibraryStore,
  catalog: LibraryCatalog,
  ids: readonly PieceId[],
): void {
  edit.editLibrary(store, catalog, (layout) => edit.restoreSongs(layout, ids))
}
