import type { PieceId } from '@/entities/piece'
import type { LibraryState } from './store'

export const selectFavourites = (state: LibraryState) => state.favourites
export const selectSort = (state: LibraryState) => state.sort

/** Whether the learner keeps this song among their favourites. */
export const selectIsFavourite =
  (id: PieceId) =>
  (state: LibraryState): boolean =>
    state.favourites.includes(id)
