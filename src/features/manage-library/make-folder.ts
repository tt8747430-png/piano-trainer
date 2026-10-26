import {
  folderName,
  MOST_FOLDERS,
  ownFolderId,
  type FolderId,
  type FolderLook,
  type LibraryCatalog,
  type LibraryStore,
  type OwnFolderId,
} from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/**
 * A folder of the learner's own, in a folder or at Home (`parent`), last there, under its name and
 * look, holding these songs (moved from wherever they stood): its id, or null where its name does not
 * read or the library is full.
 */
export function makeFolder(
  store: LibraryStore,
  catalog: LibraryCatalog,
  { name, picture, paint }: FolderLook & { name: string },
  { songs = [], parent = null }: { songs?: readonly PieceId[]; parent?: FolderId | null } = {},
): OwnFolderId | null {
  const kept = folderName(name)
  const { folders, archive, nextFolder } = store.getState()
  const held =
    folders.length +
    archive.reduce(
      (sum, entry) => sum + (entry.kind === 'folder' ? 1 + entry.subfolders.length : 0),
      0,
    )
  if (!kept || held >= MOST_FOLDERS) return null
  const id = ownFolderId(nextFolder)
  edit.editLibrary(store, catalog, (layout) =>
    edit.addFolder(
      layout,
      { id, parent, name: kept, picture, paint, builtIn: false, songs: [] },
      songs,
    ),
  )
  store.setState({ nextFolder: nextFolder + 1 })
  return id
}
