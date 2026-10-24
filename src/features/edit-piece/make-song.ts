import {
  emptyLine,
  keyText,
  ownSongId,
  songTitle,
  type OwnSongId,
  type PieceMusic,
  type PiecesStore,
  type SharedSong,
  writeBar,
  writeHand,
} from '@/entities/piece'
import { beatsPerBar, beatsToTicks, type Key, type Meter } from '@/shared/lib/music'

/**
 * What a new song's score holds (ADR 0072, 0083, 0091, 0094): the tune's staff, and the piano's two
 * staves shown (hidden, a lead sheet). Its chord symbols are typed into it; shown or not, the View's.
 */
export interface ScoreSetup {
  readonly melody: boolean
  readonly piano: boolean
}

/**
 * The scores New song starts from, as a notation app's templates: the piano first; the melody
 * alone, a lead sheet (ADR 0083); the piano with the melody.
 */
export const SCORE_TEMPLATES = {
  piano: { melody: false, piano: true },
  leadSheet: { melody: true, piano: false },
  pianoAndMelody: { melody: true, piano: true },
} as const satisfies Readonly<Record<string, ScoreSetup>>
export type ScoreTemplate = keyof typeof SCORE_TEMPLATES
export const TEMPLATES = Object.keys(SCORE_TEMPLATES) as ScoreTemplate[]

/** The template a setup is, where it is one: its staves as the template's. */
export const templateOf = (setup: ScoreSetup): ScoreTemplate | undefined =>
  TEMPLATES.find((each) => {
    const template: ScoreSetup = SCORE_TEMPLATES[each]
    return template.melody === setup.melody && template.piano === setup.piano
  })

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
 * than the pattern's notes; its score as `setup` says, a staff with nothing on it yet a rest (ADR
 * 0072), never every staff hidden: the piano hidden only with the tune's staff (ADR 0083).
 */
export function chartStart(
  key: Key,
  meter: Meter,
  setup: ScoreSetup = SCORE_TEMPLATES.piano,
): PieceMusic {
  const beats = beatsPerBar(meter)
  const ticks = beatsToTicks(beats)
  const bars = [ticks, ticks, ticks, ticks]
  const empty = emptyLine([{ startTick: 0, ticks }])
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
    ...(setup.melody ? { melody: empty } : {}),
    ...(setup.melody && !setup.piano ? { leadSheet: true } : {}),
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
