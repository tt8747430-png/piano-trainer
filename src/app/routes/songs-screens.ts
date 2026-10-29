import { arrangeLibrary, libraryCatalog, type LibraryState } from '@/entities/library'
import { repertoire, shelfOf, type PiecesState } from '@/entities/piece'
import { sectionIndex } from '@/pages/piece'

export { shelfOf } from '@/entities/piece'

/** The entry an id names in the learner's repertoire: a catalog entry in its version, or an own song. */
export const entryIn = (state: PiecesState, id: string) => repertoire(state).entry(id)

/**
 * Whether a section's page is there (ADR 0111): the piece's, on its shelf (`songs` or a study's
 * `practice`), and a section it has, counted from 1.
 */
export function sectionIn(
  state: PiecesState,
  id: string,
  section: string,
  shelf: ReturnType<typeof shelfOf>,
): boolean {
  const piece = repertoire(state).piece(id)
  return (
    piece !== undefined && shelfOf(piece.kind) === shelf && sectionIndex(piece, section) !== null
  )
}
/** Whether a folder's page is there (ADR 0106): a folder the library holds, not archived. */
export function folderIn(pieces: PiecesState, library: LibraryState, id: string): boolean {
  const { folders } = arrangeLibrary(library, libraryCatalog({ ownSongs: pieces.songs }))
  return folders.some((folder) => folder.id === id)
}
export { PiecePage, SectionPage } from '@/pages/piece'
export { ArchivePage } from '@/pages/song-archive'
export { SharedSongPage } from '@/pages/shared-song'
export { FolderPage, SongsPage } from '@/pages/songs'
export { PublicLibraryPage, PublicSongPage } from '@/pages/public-library'
