import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { PatternId } from '@/entities/pattern'
import {
  defaultLyricsStaff,
  gatherLyrics,
  HAND_IDS,
  keyText,
  lyricsStaff,
  readMusic,
  singingNotes,
  writeBar,
  writeHand,
  writeLyrics,
  writeStaff,
  type ChartPiece,
  type HandId,
  type LyricsStaff,
  type PieceMusic,
  type Section,
  type StaffName,
} from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { isOneOf } from '@/shared/lib'
import type { HandNote, Performance } from '@/shared/lib/arrangement'
import {
  type Clef,
  type Hand,
  type HandClefs,
  barMarksOf,
  beatsToTicks,
  parseKey,
  TICKS_PER_BEAT,
  type BarMarks,
  type Chord,
  type Finger,
  type Key,
  type Meter,
  type TempoUnit,
  type Midi,
  type NoteLyrics,
  type NoteMarks,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import {
  isSingleStaff,
  singleStaff,
  staffPlace,
  type SingleStaff,
  type StaffId,
} from '@/shared/lib/notation'
import { barsOf, chordsAt, sectionMeter, startsIn, type PlacedBar } from './timeline'

/**
 * What the editor writes (spec §6.1, ADR 0091, 0097): the chord symbols, a single staff by its place,
 * or one of the piano's two staves (a hand's).
 */
export type Layer = 'chords' | SingleStaff | HandId
/** A layer of notes: a single staff or a hand. */
export type NoteLayer = Exclude<Layer, 'chords'>
/** Whether a layer is a hand's: one of the piano's two staves. */
export const isHandLayer = isOneOf<HandId>(HAND_IDS)

/** A note of a staff or a hand on the piece's timeline. */
export interface DraftNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
  /** What it sings, by verse (ADR 0093): a note of the staff the words are on, a chord's one note on the upper staff. */
  readonly lyrics?: NoteLyrics
}

/** A chord from where it starts in its bar; it lasts until the next one or the barline. */
export interface DraftChord {
  readonly at: Tick
  readonly chord: Chord
  readonly method?: string
}

/** A bar as the editor holds it: its length, its chords and its barlines; every bar is written (ADR 0091). */
export interface DraftBar extends BarMarks {
  readonly ticks: Tick
  /** In order, the first at 0; none in a bar of no chord (ADR 0094). */
  readonly chords: readonly DraftChord[]
  /** The clef a hand's staff changes to here (ADR 0069). */
  readonly clefs?: HandClefs
}

/** A section's heading as the editor holds it: the song's form, with no pattern of its own (ADR 0091). */
export type DraftHeading = Omit<Section, 'lines' | 'pattern'>

export interface DraftSection {
  readonly heading: DraftHeading
  readonly lines: readonly (readonly DraftBar[])[]
}

/** A single staff over the piano's grand staff, as the editor holds it (ADR 0097). */
export interface DraftStaff {
  /** Its printed name: the content's in both languages, or the learner's; none prints none. */
  readonly name?: StaffName
  readonly clef: Clef
  /** One line: no note starts under another. */
  readonly notes: readonly DraftNote[]
}

/** A piece's music as the editor holds it: bars of chords, and notes on the timeline. */
export interface Draft {
  /** The learner's own title (ADR 0094): an own song's, or a version's in place of the catalog's. */
  readonly title?: string
  readonly key: Key
  readonly meter: Meter
  /** 4/4 printed as common time's C, 2/2 as cut time's ¢ (ADR 0114). */
  readonly timeSymbol?: true
  /** The note its tempo mark counts, where not the meter's beat (ADR 0114): ♪ = 180. */
  readonly tempoUnit?: TempoUnit
  readonly tempo: number
  /** The piece's pattern, kept for the Player's Setup; the editor's bars are all written (ADR 0091). */
  readonly pattern: PatternId
  readonly sections: readonly DraftSection[]
  /**
   * The single staves over the grand staff, top down (ADR 0097): each kept though empty (ADR 0072),
   * as many as the learner adds.
   */
  readonly staves: readonly DraftStaff[]
  /** A lead sheet: the piano's staves out of sight, their music kept (ADR 0072, 0083). */
  readonly leadSheet: boolean
  /**
   * The staff the lyrics are written on (ADR 0093, 0097): a single staff by its place, or the
   * piano's upper staff.
   */
  readonly lyricsOn: LyricsStaff
  /** Each hand's notes, in every bar. */
  readonly hands: Readonly<Record<HandId, readonly DraftNote[]>>
}

/** A hand's note as the Player plays it, on the piece's timeline, cut at `end` (its bar's). */
const playedNote = (n: Performance['notes'][number], end: Tick): DraftNote => ({
  midi: n.midi,
  spelled: n.spelled,
  startTick: n.startTick,
  durationTicks: Math.min(n.durationTicks, end - n.startTick),
  ...(n.finger === undefined ? {} : { finger: n.finger }),
  ...(n.marks ? { marks: n.marks } : {}),
  ...(n.lyrics ? { lyrics: n.lyrics } : {}),
})

/** The Player's performance of the music as written: its own key and pattern, the built-in book's. */
function performed(music: PieceMusic): Performance {
  const piece: ChartPiece = { id: 'draft', kind: 'song', title: '', ...music }
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS)
}

const inOrder = (notes: DraftNote[]): DraftNote[] =>
  notes.sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)

/**
 * Music as the editor holds it, every bar written (ADR 0091): it reads as the Player reads it, or
 * throws where it does not. A bar the music leaves a hand to the pattern is written out with what
 * the Player plays there (the pattern's notes with their fingers, each cut at the bar's end), so what
 * is heard is what is written.
 */
export function readDraft(music: PieceMusic): Draft {
  const key = parseKey(music.key)
  if (!key) throw new RangeError(`The music is in no key: "${music.key}"`)
  const { chart, staves } = readMusic(music)
  const hands: Record<HandId, DraftNote[]> = { rh: [], lh: [] }
  /** The bars each hand leaves to the pattern, on the timeline. */
  const left: { readonly hand: HandId; readonly start: Tick; readonly end: Tick }[] = []
  let tick = 0
  // The chart reads a section for each of the music's, in order: the headings are the music's.
  const sections = music.sections.map(({ lines: _lines, pattern: _pattern, ...heading }, s) => {
    return {
      heading,
      lines: (chart.sections[s]?.lines ?? []).map((line) =>
        line.map((bar): DraftBar => {
          const start = tick
          const ticks = beatsToTicks(bar.beats)
          tick += ticks
          let at = 0
          const chords = bar.chords.map(({ beats, method, ...chord }) => {
            const placed = { at, chord, ...(method ? { method } : {}) }
            at += beatsToTicks(beats)
            return placed
          })
          for (const hand of HAND_IDS) {
            const written = bar.hands?.[hand]
            if (written === undefined) left.push({ hand, start, end: start + ticks })
            for (const n of written ?? [])
              hands[hand].push({ ...n, startTick: start + n.startTick })
          }
          return {
            ticks,
            chords,
            ...barMarksOf(bar),
            ...(bar.clefs ? { clefs: bar.clefs } : {}),
          }
        }),
      ),
    }
  })
  if (left.length > 0) {
    const { notes } = performed(music)
    for (const { hand, start, end } of left) {
      for (const n of notes) {
        if (n.hand === hand && n.startTick >= start && n.startTick < end)
          hands[hand].push(playedNote(n, end))
      }
    }
  }
  return {
    ...(music.title === undefined ? {} : { title: music.title }),
    key,
    meter: music.meter,
    ...(music.timeSymbol ? { timeSymbol: true } : {}),
    ...(music.tempoUnit ? { tempoUnit: music.tempoUnit } : {}),
    tempo: music.tempo,
    pattern: music.pattern,
    sections,
    // Each single staff the music writes, rests alone included.
    staves: (music.staves ?? []).map(({ name }, place) => ({
      ...(name === undefined ? {} : { name }),
      clef: staves[place]?.clef ?? 'treble',
      notes: [...(staves[place]?.notes ?? [])],
    })),
    leadSheet: music.leadSheet === true && (music.staves?.length ?? 0) > 0,
    lyricsOn: lyricsStaff(music),
    hands: { rh: inOrder(hands.rh), lh: inOrder(hands.lh) },
  }
}

/** A draft bar as the chart reads it: its chords with their beats. */
function chartBar(bar: DraftBar) {
  return {
    chords: chordsAt(bar).map(({ chord, ticks, method }) => ({
      ...chord,
      beats: ticks / TICKS_PER_BEAT,
      ...(method ? { method } : {}),
    })),
    beats: bar.ticks / TICKS_PER_BEAT,
    ...barMarksOf(bar),
  }
}

/** A hand's notes bar by bar, from each bar's start. */
function handBars(notes: readonly DraftNote[], bars: readonly PlacedBar[]): HandNote[][] {
  return bars.map((placed) =>
    notes
      .filter((n) => startsIn(n.startTick, placed))
      .map((n) => ({ ...n, startTick: n.startTick - placed.start })),
  )
}

/** The single staff the lyrics are written on, as a layer; the upper staff's where they are on it. */
export const lyricsLayer = (draft: Pick<Draft, 'lyricsOn'>): NoteLayer =>
  draft.lyricsOn === 'rh' ? 'rh' : singleStaff(draft.lyricsOn)

/**
 * The notes the lyrics go under (ADR 0093, 0097): the single staff's they are on, or the right
 * hand's where they are on the upper staff, a chord of them one note.
 */
export const tuneNotes = (draft: Draft): DraftNote[] =>
  draft.lyricsOn === 'rh'
    ? singingNotes(draft.hands.rh)
    : [...(draft.staves[draft.lyricsOn]?.notes ?? [])]

/** The draft as the content writes music: every bar of both hands written (ADR 0091), its words as verses. */
export function writeDraft(draft: Draft): PieceMusic {
  const placed = barsOf(draft)
  const timeline = placed.map(({ start, bar }) => ({ startTick: start, ticks: bar.ticks }))
  const ticks = placed.map(({ bar }) => bar.ticks)
  const clefs = (hand: Hand) => placed.map(({ bar }) => bar.clefs?.[hand])
  const lyrics = gatherLyrics(tuneNotes(draft)).map(writeLyrics)
  // A staff the score has is written though empty, as a rest, so it stays (ADR 0072).
  const staves = draft.staves.map(({ name, clef, notes }) => ({
    ...(name === undefined ? {} : { name }),
    ...(clef === 'treble' ? {} : { clef }),
    notes: writeStaff(notes, timeline),
  }))
  return {
    ...(draft.title === undefined ? {} : { title: draft.title }),
    key: keyText(draft.key),
    meter: draft.meter,
    ...(draft.timeSymbol ? { timeSymbol: true } : {}),
    ...(draft.tempoUnit ? { tempoUnit: draft.tempoUnit } : {}),
    tempo: draft.tempo,
    pattern: draft.pattern,
    // Each bar in its section's meter (ADR 0095).
    sections: draft.sections.map((section, s) => ({
      ...section.heading,
      lines: section.lines.map((line) =>
        line.map((bar) => writeBar(chartBar(bar), sectionMeter(draft, s))).join(' '),
      ),
    })),
    ...(staves.length > 0 ? { staves } : {}),
    ...(draft.leadSheet && staves.length > 0 ? { leadSheet: true } : {}),
    ...(lyrics.length > 0 ? { lyrics } : {}),
    // Where they are not on the top single staff, where the music would put them: written.
    ...(lyrics.length > 0 && draft.lyricsOn !== defaultLyricsStaff({ staves })
      ? { lyricsOn: draft.lyricsOn }
      : {}),
    hands: {
      rh: writeHand(handBars(draft.hands.rh, placed), ticks, clefs('rh')),
      lh: writeHand(handBars(draft.hands.lh, placed), ticks, clefs('lh')),
    },
  }
}

/**
 * The music to save for a draft, read back as a piece's to be sure it reads; null where it would not
 * (an edit the format cannot hold): nothing then is saved over music that opens.
 */
export function musicToSave(draft: Draft): PieceMusic | null {
  try {
    const music = writeDraft(draft)
    readMusic(music)
    return music
  } catch {
    return null
  }
}

/** The draft with every staff's notes changed alike: each single staff's, then each hand's. */
export const withEveryStaff = (
  draft: Draft,
  change: (notes: readonly DraftNote[], layer: NoteLayer) => DraftNote[],
): Draft => ({
  ...draft,
  staves: draft.staves.map((staff, place) => ({
    ...staff,
    notes: change(staff.notes, singleStaff(place)),
  })),
  hands: { rh: change(draft.hands.rh, 'rh'), lh: change(draft.hands.lh, 'lh') },
})

/** The single staff a layer is, where it is one the draft has. */
export const singleStaffOf = (
  draft: Pick<Draft, 'staves'>,
  layer: Layer,
): DraftStaff | undefined =>
  layer === 'chords' || isHandLayer(layer) ? undefined : draft.staves[staffPlace(layer)]

/**
 * The staff a layer of notes writes on (ADR 0097): a single staff its own, the right hand the
 * treble, the left the bass.
 */
export const layerStaff = (layer: NoteLayer): StaffId =>
  isHandLayer(layer) ? (layer === 'lh' ? 'bass' : 'treble') : layer

/** The layer that writes on a staff: a single staff its own, the treble the right hand, the bass the left. */
export const staffLayer = (staff: StaffId): NoteLayer =>
  isSingleStaff(staff) ? staff : staff === 'bass' ? 'lh' : 'rh'
