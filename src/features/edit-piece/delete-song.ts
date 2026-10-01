import type { OwnSongId, PiecesStore } from '@/entities/piece'

/** Deletes the learner's song; its number is never given again. */
export function deleteSong(store: PiecesStore, id: OwnSongId): void {
  store.setState((state) => ({ songs: state.songs.filter((song) => song.id !== id) }))
}
