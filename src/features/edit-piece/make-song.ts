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
import type { LocalText } from '@/shared/i18n'
import {
  beatsPerBar,
  beatsToTicks,
  type Clef,
  type Key,
  type Meter,
  type TempoUnit,
} from '@/shared/lib/music'

/**
 * The voices a new song's single staves can be (round 27, Flat's Vocals): each a staff named for it
 * in its own clef, over the piano. Other instruments wait for their own sounds (ADR 0097).
 */
export const VOICES = {
  voice: { clef: 'treble', name: { en: 'Voice', ru: 'Голос' } },
  soprano: { clef: 'treble', name: { en: 'Soprano', ru: 'Сопрано' } },
  alto: { clef: 'treble', name: { en: 'Alto', ru: 'Альт' } },
  tenor: { clef: 'treble-8vb', name: { en: 'Tenor', ru: 'Тенор' } },
  baritone: { clef: 'bass', name: { en: 'Baritone', ru: 'Баритон' } },
  bass: { clef: 'bass', name: { en: 'Bass', ru: 'Бас' } },
} as const satisfies Record<string, { clef: Clef; name: LocalText }>
export type VoiceId = keyof typeof VOICES
/** The voices in the order a score stacks them, top down. */
export const VOICE_IDS = Object.keys(VOICES) as VoiceId[]

/** The most single staves a new song starts with over the piano; more are added on the score. */
export const SINGLE_STAVES_MAX = 8

/**
 * The staves a new song's score starts with (ADR 0114, 0097), chosen as a notation app's new score
 * chooses its instruments (Flat's): the piano's grand staff or not, and its voices' staves over it,
 * top down. Without the piano, one voice alone: a lead sheet, its piano out of sight. More are added,
 * named and taken away on the score.
 */
export interface ScoreStaves {
  readonly piano: boolean
  readonly voices: readonly VoiceId[]
}

/** The piano's grand staff alone: where a new song starts unless asked otherwise. */
export const PIANO_ONLY: ScoreStaves = { piano: true, voices: [] }

/** Whether a choice of staves can be a score's: never none, without the piano one voice alone. */
export const isScoreStaves = ({ piano, voices }: ScoreStaves): boolean =>
  piano ? voices.length <= SINGLE_STAVES_MAX : voices.length === 1

/** How a new song starts beyond its key and meter (Flat's "Fine-tune your setup"). */
export interface SongStart {
  readonly staves?: ScoreStaves
  /** Its tempo, in beats of `tempoUnit` a minute. */
  readonly tempo?: number
  readonly tempoUnit?: TempoUnit
  /** How many empty bars it starts with. */
  readonly bars?: number
  /** 4/4 printed as common time's C, 2/2 as cut time's ¢ (ADR 0114). */
  readonly timeSymbol?: boolean
}

/** What New song asks: a title as typed, a key, a meter and how it starts. */
interface SongDraft extends SongStart {
  readonly title: string
  readonly key: Key
  readonly meter: Meter
}

/** The bars a new song starts with, as a notation app's new score: four, unless asked. */
export const START_BARS = 4
/** Its tempo unless asked. */
export const START_TEMPO = 90

/**
 * Where a new song starts: a verse of empty bars (four at 90 unless asked), as a notation app's new
 * score (ADR 0114): no chord symbol, both hands written silent, so the editor opens on empty bars
 * rather than the pattern's notes; its staves as chosen, a voice's staff named for it with nothing on it yet a rest
 * (ADR 0114, 0097), the piano hidden only under one voice alone (a lead sheet).
 */
export function chartStart(
  key: Key,
  meter: Meter,
  {
    staves = PIANO_ONLY,
    tempo = START_TEMPO,
    tempoUnit,
    bars: count = START_BARS,
    timeSymbol = false,
  }: SongStart = {},
): PieceMusic {
  const beats = beatsPerBar(meter)
  const ticks = beatsToTicks(beats)
  const bars = Array.from({ length: Math.max(1, Math.round(count)) }, () => ticks)
  const silent = writeHand(
    bars.map(() => []),
    bars,
  )
  const bar = writeBar({ chords: [], beats }, meter)
  const rest = writeStaff([], [{ startTick: 0, ticks }])
  return {
    key: keyText(key),
    meter,
    ...(timeSymbol && (meter === '4/4' || meter === '2/2') ? { timeSymbol: true as const } : {}),
    tempo,
    ...(tempoUnit && tempoUnit !== '4' ? { tempoUnit } : {}),
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: [bars.map(() => bar).join(' ')] }],
    ...(staves.voices.length > 0
      ? {
          // Each voice's staff named for it; the treble clef, a staff's own, written as none.
          staves: [...staves.voices]
            .sort((a, b) => VOICE_IDS.indexOf(a) - VOICE_IDS.indexOf(b))
            .map((voice) => {
              const { clef, name } = VOICES[voice]
              return { name, ...(clef === 'treble' ? {} : { clef }), notes: rest }
            }),
        }
      : {}),
    ...(staves.piano ? {} : { leadSheet: true }),
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
    songs: [...songs, { id, title, ...chartStart(draft.key, draft.meter, draft) }],
    nextSong: nextSong + 1,
  })
  return id
}

/**
 * Makes a song that came from elsewhere (a shared link, the Public library) the learner's, under the
 * next number; from the Public library, with who published it.
 */
export function addSong(store: PiecesStore, song: SharedSong, author?: string): OwnSongId {
  const { songs, nextSong } = store.getState()
  const id = ownSongId(nextSong)
  store.setState({
    songs: [...songs, { id, title: song.title, ...song.music, ...(author ? { author } : {}) }],
    nextSong: nextSong + 1,
  })
  return id
}
