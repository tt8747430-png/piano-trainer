import type { OwnSongId, PiecesStore } from '@/entities/piece'
import type { TakesStore } from '@/entities/take'

/** Deletes the learner's song and its takes; its number is never given again. */
export function deleteSong(pieces: PiecesStore, takes: TakesStore, id: OwnSongId): void {
  pieces.setState((state) => ({ songs: state.songs.filter((song) => song.id !== id) }))
  takes.setState((state) => ({ takes: state.takes.filter((take) => take.pieceId !== id) }))
}
