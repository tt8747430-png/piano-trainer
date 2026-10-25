import { repertoire, shelfOf, type PiecesState } from '@/entities/piece'
import { sectionIndex } from '@/pages/piece'

export { shelfOf } from '@/entities/piece'

/** The entry an id names in the learner's repertoire: a catalog entry in its version, or an own song. */
export const entryIn = (state: PiecesState, id: string) => repertoire(state).entry(id)

/**
 * Whether a section's page is there (ADR 0100): the piece's, on its shelf (`songs` or a study's
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
export { PiecePage, SectionPage } from '@/pages/piece'
export { SharedSongPage } from '@/pages/shared-song'
export { SongsPage } from '@/pages/songs'
