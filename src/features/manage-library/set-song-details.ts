import { NO_DETAILS, tagsOf, type LibraryStore, type SongDetails } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/**
 * A song's details changed (R30 S5, its page's Edit): what is given merged into what is kept, its tags
 * tidied (each once, trimmed, in lower case); a song whose details then say nothing is forgotten.
 */
export function setSongDetails(
  store: LibraryStore,
  id: PieceId,
  change: Partial<SongDetails>,
): void {
  const { [id]: was, ...rest } = store.getState().songDetails
  const next = { ...NO_DETAILS, ...was, ...change }
  const details: SongDetails = { ...next, tags: tagsOf(next.tags) }
  const empty =
    details.level === null &&
    details.genre === null &&
    details.language === null &&
    details.tags.length === 0
  store.setState({ songDetails: empty ? rest : { ...rest, [id]: details } })
}
