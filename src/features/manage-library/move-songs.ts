import type { FolderId, LibraryCatalog, LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/**
 * Songs moved to the end of a folder or of Home (`null`): returns where each stood, for the toast's
 * Undo (`undoMove`). A song already there is left where it is.
 */
export function moveSongs(
  store: LibraryStore,
  catalog: LibraryCatalog,
  ids: readonly PieceId[],
  to: FolderId | null,
): edit.Moved[] {
  let moved: edit.Moved[] = []
  edit.editLibrary(store, catalog, (layout) => {
    moved = edit.placesOf(layout, ids).filter((each) => each.from.folder !== to)
    return edit.moveSongs(
      layout,
      moved.map((each) => each.id),
      to,
    )
  })
  return moved
}

/** Moved songs put back exactly where they stood: a move's Undo. */
export function undoMove(
  store: LibraryStore,
  catalog: LibraryCatalog,
  moved: readonly edit.Moved[],
): void {
  edit.editLibrary(store, catalog, (layout) => edit.putBack(layout, moved))
}
