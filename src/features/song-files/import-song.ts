import { libraryCatalog, type FolderId, type LibraryStore } from '@/entities/library'
import type { OwnSongId, PiecesStore, SharedSong } from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { moveTo } from '@/features/manage-library'

/**
 * Makes a song read from a file the learner's own, under the next number, where the learner is
 * (ADR 0106): in the folder open, else at Home, last.
 */
export function importSong(
  pieces: PiecesStore,
  library: LibraryStore,
  song: SharedSong,
  folder: FolderId | null,
): OwnSongId {
  const id = addSong(pieces, song)
  if (folder)
    moveTo(
      library,
      libraryCatalog({ ownSongs: pieces.getState().songs }),
      { songs: [id], folders: [] },
      folder,
    )
  return id
}
