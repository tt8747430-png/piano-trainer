import { songTitle, type OwnSongId, type PiecesStore } from '@/entities/piece'

/** Gives the learner's song a new title; an empty or too long one changes nothing. */
export function renameSong(store: PiecesStore, id: OwnSongId, text: string): void {
  const title = songTitle(text)
  if (!title) return
  store.setState((state) => ({
    songs: state.songs.map((song) => (song.id === id ? { ...song, title } : song)),
  }))
}
