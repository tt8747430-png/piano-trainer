import { keyText, ownSongId, songTitle, type OwnSongId, type PiecesStore } from '@/entities/piece'
import { keySymbol, type Key, type Meter } from '@/shared/lib/music'

/** What New song asks: a title as typed, a key and a meter. */
export interface SongDraft {
  readonly title: string
  readonly key: Key
  readonly meter: Meter
}

/**
 * Makes the learner's song under the next number: a verse of four bars of its key's tonic chord, at 90,
 * played by the harmonic basis. Hands back its id; null, and nothing made, without a title.
 */
export function makeSong(store: PiecesStore, draft: SongDraft): OwnSongId | null {
  const title = songTitle(draft.title)
  if (!title) return null
  const { songs, nextSong } = store.getState()
  const id = ownSongId(nextSong)
  const tonic = keySymbol(draft.key)
  store.setState({
    songs: [
      ...songs,
      {
        id,
        title,
        key: keyText(draft.key),
        meter: draft.meter,
        tempo: 90,
        pattern: 'r1',
        sections: [{ kind: 'verse', lines: [[tonic, tonic, tonic, tonic].join(' ')] }],
      },
    ],
    nextSong: nextSong + 1,
  })
  return id
}
