import type { LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { mergeVisibleOrder } from '@/shared/lib'

/**
 * Puts a setlist's songs in the order they were dropped in on screen: those shown take that order in
 * the places they held, and a song not shown (a search hid it, or the repertoire no longer has it)
 * keeps its own.
 */
export function moveInSetlist(store: LibraryStore, id: string, order: readonly PieceId[]): void {
  store.setState(({ setlists }) => ({
    setlists: setlists.map((setlist) =>
      setlist.id === id
        ? { ...setlist, pieces: mergeVisibleOrder(setlist.pieces, order) }
        : setlist,
    ),
  }))
}
