import type { LibraryCatalog } from '@/entities/library'
import { isOwnSongId, type PieceId } from '@/entities/piece'
import { deleteSong } from '@/features/edit-piece'
import type { DeletingStores } from './delete-folder'
import * as edit from './model/layout-edits'

/** The learner's own songs deleted for good, with their takes, out of every list (the app's are never). */
export function deleteOwnSongs(
  { library, pieces, takes }: DeletingStores,
  catalog: LibraryCatalog,
  ids: readonly PieceId[],
): void {
  const own = ids.filter(isOwnSongId)
  edit.editLibrary(library, catalog, (layout) => edit.dropSongs(layout, own))
  const gone = new Set<string>(own)
  library.setState(({ favourites }) => ({
    favourites: favourites.filter((id) => !gone.has(id)),
  }))
  for (const id of own) deleteSong(pieces, takes, id)
}
