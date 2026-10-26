import type { LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/** Takes a song out of a setlist; the song itself stays where it is. */
export function removeFromSetlist(store: LibraryStore, id: string, piece: PieceId): void {
  store.setState(({ setlists }) => ({
    setlists: setlists.map((setlist) =>
      setlist.id === id
        ? { ...setlist, pieces: setlist.pieces.filter((each) => each !== piece) }
        : setlist,
    ),
  }))
}
