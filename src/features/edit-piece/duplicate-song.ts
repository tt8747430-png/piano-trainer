import { musicOf, type ChartPiece, type OwnSongId, type PiecesStore } from '@/entities/piece'
import { addSong } from './make-song'

/**
 * A copy of a song as the learner's own (R29 B9, Duplicate): its music under `title`, the next own
 * number; the song it came from left as it is.
 */
export function duplicateSong(store: PiecesStore, piece: ChartPiece, title: string): OwnSongId {
  return addSong(store, { title, music: musicOf(piece) })
}
