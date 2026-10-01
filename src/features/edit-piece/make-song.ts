import {
  keyText,
  ownSongId,
  songTitle,
  type OwnSongId,
  type PieceMusic,
  type PiecesStore,
} from '@/entities/piece'
import { keySymbol, type Key, type Meter } from '@/shared/lib/music'

/** What New song asks: a title as typed, a key and a meter. */
export interface SongDraft {
  readonly title: string
  readonly key: Key
  readonly meter: Meter
}

/** Where a new chart starts: a verse of four bars of the key's tonic chord, at 90, the harmonic basis. */
export function chartStart(key: Key, meter: Meter): PieceMusic {
  const tonic = keySymbol(key)
  return {
    key: keyText(key),
    meter,
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: [[tonic, tonic, tonic, tonic].join(' ')] }],
  }
}

/**
 * Makes the learner's song under the next number, its chart started (`chartStart`). Hands back its id;
 * null, and nothing made, without a title.
 */
export function makeSong(store: PiecesStore, draft: SongDraft): OwnSongId | null {
  const title = songTitle(draft.title)
  if (!title) return null
  const { songs, nextSong } = store.getState()
  const id = ownSongId(nextSong)
  store.setState({
    songs: [...songs, { id, title, ...chartStart(draft.key, draft.meter) }],
    nextSong: nextSong + 1,
  })
  return id
}
