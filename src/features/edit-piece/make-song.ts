import {
  keyText,
  ownSongId,
  songTitle,
  type OwnSongId,
  type PieceMusic,
  type PiecesStore,
  type SharedSong,
  writeBar,
  writeHand,
  writeStaff,
} from '@/entities/piece'
import { beatsPerBar, beatsToTicks, type Key, type Meter } from '@/shared/lib/music'

/**
 * The staves a new song's score starts with (ADR 0083, 0094, 0097), as a notation app's new score
 * asks: the piano's grand staff; a single staff over it; or a single staff alone, the piano out of
 * sight (a lead sheet). More are added, named and taken away on the score. Its chord symbols are
 * typed into it; shown or not, the View's.
 */
export const SCORE_SETUPS = ['piano', 'staffAndPiano', 'staff'] as const
export type ScoreSetup = (typeof SCORE_SETUPS)[number]

/** What New song asks: a title as typed, a key, a meter and what its score holds. */
interface SongDraft {
  readonly title: string
  readonly key: Key
  readonly meter: Meter
  readonly setup?: ScoreSetup
}

/**
 * Where a new song starts: a verse of four empty bars at 90, as a notation app's new score (ADR
 * 0091, 0094): no chord symbol, both hands written silent, so the editor opens on empty bars rather
 * than the pattern's notes; its staves as `setup` says, a single staff with nothing on it yet a rest
 * (ADR 0072, 0097), never every staff hidden: the piano hidden only under a single staff (ADR 0083).
 */
export function chartStart(key: Key, meter: Meter, setup: ScoreSetup = 'piano'): PieceMusic {
  const beats = beatsPerBar(meter)
  const ticks = beatsToTicks(beats)
  const bars = [ticks, ticks, ticks, ticks]
  const silent = writeHand(
    bars.map(() => []),
    bars,
  )
  const bar = writeBar({ chords: [], beats }, meter)
  return {
    key: keyText(key),
    meter,
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: [bars.map(() => bar).join(' ')] }],
    ...(setup === 'piano'
      ? {}
      : { staves: [{ notes: writeStaff([], [{ startTick: 0, ticks }]) }] }),
    ...(setup === 'staff' ? { leadSheet: true } : {}),
    hands: { rh: silent, lh: silent },
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
    songs: [...songs, { id, title, ...chartStart(draft.key, draft.meter, draft.setup) }],
    nextSong: nextSong + 1,
  })
  return id
}

/** Makes a song that came from elsewhere (a shared link) the learner's, under the next number. */
export function addSong(store: PiecesStore, song: SharedSong): OwnSongId {
  const { songs, nextSong } = store.getState()
  const id = ownSongId(nextSong)
  store.setState({
    songs: [...songs, { id, title: song.title, ...song.music }],
    nextSong: nextSong + 1,
  })
  return id
}
