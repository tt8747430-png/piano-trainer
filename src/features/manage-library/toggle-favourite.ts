import { MOST_PIECES, type LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/** Keeps a song among the favourites, the newest first (the oldest let go past the most kept), or lets it go. */
export function toggleFavourite(store: LibraryStore, id: PieceId): void {
  const { favourites } = store.getState()
  setFavourites(store, [id], !favourites.includes(id))
}

/** Songs kept among the favourites, the newest first, or let go: Select's Favourite. */
export function setFavourites(store: LibraryStore, ids: readonly PieceId[], on: boolean): void {
  store.setState(({ favourites }) => {
    const rest = favourites.filter((each) => !ids.includes(each))
    return { favourites: on ? [...new Set(ids), ...rest].slice(0, MOST_PIECES) : rest }
  })
}
