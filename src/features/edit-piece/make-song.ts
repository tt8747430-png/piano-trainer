import {
  emptyLine,
  keyText,
  ownSongId,
  showsAStaff,
  songTitle,
  type HiddenRow,
  type OwnSongId,
  type PieceMusic,
  type PiecesStore,
  type SharedSong,
} from '@/entities/piece'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import {
  beatsPerBar,
  beatsToTicks,
  DEFAULT_INSTRUMENT,
  keySymbol,
  type Instrument,
  type Key,
  type Meter,
} from '@/shared/lib/music'

/**
 * What a new song's score holds (ADR 0072, 0083): the chord names shown, the tune's staff, more parts
 * each on an instrument, and the piano's two staves shown (hidden, a lead sheet).
 */
export interface ScoreSetup {
  readonly chordNames: boolean
  readonly melody: boolean
  readonly piano: boolean
  readonly parts: readonly Instrument[]
}

/**
 * The scores New song starts from, as a notation app's templates: chords and piano first; the
 * melody and chords alone, a lead sheet (ADR 0083); the piano with the melody; the piano alone.
 */
export const SCORE_TEMPLATES = {
  chordsAndPiano: { chordNames: true, melody: false, piano: true, parts: [] },
  leadSheet: { chordNames: true, melody: true, piano: false, parts: [] },
  pianoAndMelody: { chordNames: true, melody: true, piano: true, parts: [] },
  piano: { chordNames: false, melody: false, piano: true, parts: [] },
} as const satisfies Readonly<Record<string, ScoreSetup>>
export type ScoreTemplate = keyof typeof SCORE_TEMPLATES
export const TEMPLATES = Object.keys(SCORE_TEMPLATES) as ScoreTemplate[]

/** The template a setup is, where it is one: its rows as the template's, and no more parts. */
export const templateOf = (setup: ScoreSetup): ScoreTemplate | undefined =>
  TEMPLATES.find((each) => {
    const template: ScoreSetup = SCORE_TEMPLATES[each]
    return (
      template.chordNames === setup.chordNames &&
      template.melody === setup.melody &&
      template.piano === setup.piano &&
      setup.parts.length === 0
    )
  })

/** The most parts a song sings besides its tune: one staff for each more voice (ADR 0066). */
export const MOST_PARTS = EXTRA_VOICES.length

/** What New song asks: a title as typed, a key, a meter and what its score holds. */
interface SongDraft {
  readonly title: string
  readonly key: Key
  readonly meter: Meter
  readonly setup?: ScoreSetup
}

/**
 * Where a new chart starts: a verse of four bars of the key's tonic chord, at 90, the harmonic basis;
 * its score as `setup` says, a staff with nothing on it yet a rest (ADR 0072), never every staff
 * hidden (ADR 0083).
 */
export function chartStart(
  key: Key,
  meter: Meter,
  setup: ScoreSetup = SCORE_TEMPLATES.chordsAndPiano,
): PieceMusic {
  const tonic = keySymbol(key)
  const empty = emptyLine([{ startTick: 0, ticks: beatsToTicks(beatsPerBar(meter)) }])
  const parts = setup.parts.slice(0, MOST_PARTS)
  const instruments = [DEFAULT_INSTRUMENT, ...parts]
  // The piano hidden only while another staff is in sight (ADR 0083).
  const named: HiddenRow[] = [
    ...(setup.chordNames ? [] : ['chords' as const]),
    ...(setup.piano ? [] : ['piano' as const]),
  ]
  const staves = { melody: setup.melody, voices: parts.length }
  const hidden = showsAStaff(named, staves) ? named : named.filter((row) => row !== 'piano')
  return {
    key: keyText(key),
    meter,
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: [[tonic, tonic, tonic, tonic].join(' ')] }],
    ...(setup.melody ? { melody: empty } : {}),
    ...(parts.length > 0 ? { voices: parts.map(() => empty) } : {}),
    ...(instruments.some((one) => one !== DEFAULT_INSTRUMENT) ? { instruments } : {}),
    ...(hidden.length > 0 ? { hidden } : {}),
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
