import type { LibraryCatalog, LibraryStore } from '@/entities/library'
import * as edit from './model/layout-edits'

/** Everything in the archive back in the library: each folder at Home, last, each song where it stood. */
export function restoreAll(store: LibraryStore, catalog: LibraryCatalog): void {
  edit.editLibrary(store, catalog, (layout) => {
    const oldestFirst = layout.archive.toReversed()
    const folders = oldestFirst.flatMap((entry) =>
      entry.kind === 'folder' ? [entry.folder.id] : [],
    )
    const songs = oldestFirst.flatMap((entry) => (entry.kind === 'song' ? [entry.id] : []))
    // The folders first, so a song whose folder was archived after it goes back into it.
    const withFolders = folders.reduce((each, id) => edit.restoreFolder(each, id), layout)
    return edit.restoreSongs(withFolders, songs)
  })
}
