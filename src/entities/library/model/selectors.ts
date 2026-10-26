import type { Piece, PieceId, Repertoire } from '@/entities/piece'
import type { LibraryState } from './store'
import { MOST_SETLISTS, type Setlist } from './types'

export const selectFavourites = (state: LibraryState) => state.favourites
export const selectSetlists = (state: LibraryState) => state.setlists

/** Whether the learner keeps this song among their favourites. */
export const selectIsFavourite =
  (id: PieceId) =>
  (state: LibraryState): boolean =>
    state.favourites.includes(id)

/** The setlist with this id, while it is there. */
export const selectSetlist =
  (id: string) =>
  (state: LibraryState): Setlist | undefined =>
    state.setlists.find((setlist) => setlist.id === id)

/** Whether the library has room for another setlist. */
export const selectRoomForSetlist = (state: LibraryState): boolean =>
  state.setlists.length < MOST_SETLISTS

/**
 * A list's songs as the learner has them, in its order: an id the repertoire no longer plays (an own
 * song deleted, a piece a later catalog dropped) is left out where it is read, never written away.
 */
export const piecesIn = (ids: readonly PieceId[], repertoire: Pick<Repertoire, 'piece'>): Piece[] =>
  ids.flatMap((id) => {
    const piece = repertoire.piece(id)
    return piece ? [piece] : []
  })
