import {
  sameMusic,
  type OwnSongId,
  type PieceId,
  type PieceMusic,
  type PiecesStore,
} from '@/entities/piece'
import { resetVersion } from './reset-version'

/**
 * Whose music is written: a catalog piece's version, against the music a version equal to is none (the
 * original, a listing's chart start), or an own song.
 */
export type MusicTarget =
  | { readonly kind: 'version'; readonly id: PieceId; readonly original: PieceMusic }
  | { readonly kind: 'song'; readonly id: OwnSongId }

/** Saves the music written: a version equal to its original is no version, and is removed. */
export function saveMusic(store: PiecesStore, target: MusicTarget, music: PieceMusic): void {
  if (target.kind === 'song') {
    store.setState((state) => ({
      songs: state.songs.map((song) =>
        song.id === target.id ? { id: song.id, title: song.title, ...music } : song,
      ),
    }))
  } else if (sameMusic(target.original, music)) {
    resetVersion(store, target.id)
  } else {
    store.setState((state) => ({ versions: { ...state.versions, [target.id]: music } }))
  }
}
