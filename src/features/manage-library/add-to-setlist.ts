import { MOST_PIECES, type LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/** Adds a song at a setlist's end, once; nothing past the most a list keeps. */
export function addToSetlist(store: LibraryStore, id: string, piece: PieceId): void {
  store.setState(({ setlists }) => ({
    setlists: setlists.map((setlist) =>
      setlist.id !== id || setlist.pieces.includes(piece) || setlist.pieces.length >= MOST_PIECES
        ? setlist
        : { ...setlist, pieces: [...setlist.pieces, piece] },
    ),
  }))
}
