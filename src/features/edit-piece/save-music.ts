import {
  sameMusic,
  type OwnSongId,
  type PieceId,
  type PieceMusic,
  type PiecesStore,
} from '@/entities/piece'

/** Whose music is written: a catalog piece's version (against its original, none for a listing) or an own song. */
export type MusicTarget =
  | { readonly kind: 'version'; readonly id: PieceId; readonly original: PieceMusic | null }
  | { readonly kind: 'song'; readonly id: OwnSongId }

/** Saves the music written: a version equal to its original is no version, and is removed. */
export function saveMusic(store: PiecesStore, target: MusicTarget, music: PieceMusic): void {
  if (target.kind === 'song') {
    store.setState((state) => ({
      songs: state.songs.map((song) =>
        song.id === target.id ? { id: song.id, title: song.title, ...music } : song,
      ),
    }))
    return
  }
  const others = Object.fromEntries(
    Object.entries(store.getState().versions).filter(([id]) => id !== target.id),
  )
  store.setState({
    versions:
      target.original && sameMusic(target.original, music)
        ? others
        : { ...others, [target.id]: music },
  })
}
