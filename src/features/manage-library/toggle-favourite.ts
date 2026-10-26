import { MOST_PIECES, type LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/** Keeps a song among the favourites, the newest first (the oldest let go past the most kept), or lets it go. */
export function toggleFavourite(store: LibraryStore, id: PieceId): void {
  store.setState(({ favourites }) => ({
    favourites: favourites.includes(id)
      ? favourites.filter((each) => each !== id)
      : [id, ...favourites].slice(0, MOST_PIECES),
  }))
}
