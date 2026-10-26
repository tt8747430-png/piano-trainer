import type { FolderId, LibraryCatalog, LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import * as edit from './model/layout-edits'

/** What Move to… takes: songs, and folders with all they hold. */
export interface Moving {
  readonly songs: readonly PieceId[]
  readonly folders: readonly FolderId[]
}

/** What one move moved, each with where it stood: what the toast's Undo puts back. */
export interface Moves {
  readonly songs: readonly edit.Moved[]
  readonly folders: readonly edit.FolderMoved[]
}

/**
 * Songs and folders moved into a folder or Home (`null`), last there (ADR 0106): a song or folder
 * already there is left where it is, and no folder moves into itself or a folder under it. Returns
 * what moved, for the toast's Undo (`undoMove`).
 */
export function moveTo(
  store: LibraryStore,
  catalog: LibraryCatalog,
  { songs, folders }: Moving,
  to: FolderId | null,
): Moves {
  let moves: Moves = { songs: [], folders: [] }
  edit.editLibrary(store, catalog, (layout) => {
    moves = {
      songs: edit.placesOf(layout, songs).filter((each) => each.from.folder !== to),
      folders: edit.folderPlacesOf(layout, folders, to),
    }
    const withFolders = edit.moveFolders(
      layout,
      moves.folders.map((each) => each.id),
      to,
    )
    return edit.moveSongs(
      withFolders,
      moves.songs.map((each) => each.id),
      to,
    )
  })
  return moves
}

/** What a move moved, put back exactly where each stood: its Undo. */
export function undoMove(store: LibraryStore, catalog: LibraryCatalog, moves: Moves): void {
  edit.editLibrary(store, catalog, (layout) =>
    edit.putBack(edit.putFoldersBack(layout, moves.folders), moves.songs),
  )
}
