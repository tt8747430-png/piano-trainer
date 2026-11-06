import type { LibraryCatalog, LibraryStore } from '@/entities/library'
import { isOwnSongId, type PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/**
 * The learner's own songs deleted (R34, StemDeck's Trash): out of every list into the Trash, each
 * saying where it stood (the app's are never deleted). Returns those trashed, for the toast's Undo,
 * which is their Restore (`restoreTrashed`).
 */
export function trashSongs(
  store: LibraryStore,
  catalog: LibraryCatalog,
  ids: readonly PieceId[],
): PieceId[] {
  const own = ids.filter(isOwnSongId)
  edit.editLibrary(store, catalog, (layout) => edit.trashSongs(layout, own))
  return own
}
