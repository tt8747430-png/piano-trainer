import {
  folderName,
  type FolderId,
  type FolderLook,
  type LibraryCatalog,
  type LibraryStore,
} from '@/entities/library'
import * as edit from './model/layout-edits'

/**
 * A folder's name and look changed (Edit folder): a name that does not read changes nothing of it; a
 * built-in folder given none (`undefined`) says its collection's again.
 */
export function editFolder(
  store: LibraryStore,
  catalog: LibraryCatalog,
  id: FolderId,
  { name, picture, paint }: FolderLook & { name: string | undefined },
): void {
  const kept = name === undefined ? undefined : folderName(name)
  edit.editLibrary(store, catalog, (layout) =>
    edit.changeFolder(layout, id, ({ name: was, ...folder }) => {
      const named = kept === null ? was : kept
      // An own folder always keeps a name.
      const next = named ?? (folder.builtIn ? undefined : was)
      return { ...folder, picture, paint, ...(next ? { name: next } : {}) }
    }),
  )
}
