import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { PatternId } from '@/entities/pattern'
import {
  emptyLine,
  gatherLyrics,
  HAND_IDS,
  keyText,
  readMusic,
  singingNotes,
  writeBar,
  writeHand,
  writeLyrics,
  writeMelody,
  type ChartPiece,
  type HandId,
  type PieceMusic,
  type Section,
} from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { isOneOf } from '@/shared/lib'
import type { HandNote, Performance } from '@/shared/lib/arrangement'
import {
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
  type Midi,
  type NoteLyrics,
  type NoteMarks,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import { barsOf, chordsAt, startsIn, type PlacedBar } from './timeline'

/** What the editor writes (spec §6.1, ADR 0091): the chords, the melody or a hand. */
export type Layer = 'chords' | 'melody' | HandId
/** A layer of notes: the melody or a hand. */
export type NoteLayer = Exclude<Layer, 'chords'>
/** Whether a layer is a hand's: one of the piano's two staves. */
export const isHandLayer = isOneOf<HandId>(HAND_IDS)

/** A note of the melody or a hand on the piece's timeline. */
export interface DraftNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
  /** What it sings, by verse (ADR 0093): a note of the tune's staff, or of the right hand's chord where that is the tune. */
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
  /** In order, the first at 0. */
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

/** A piece's music as the editor holds it: bars of chords, and notes on the timeline. */
export interface Draft {
  /** The learner's own title (ADR 0094): an own song's, or a version's in place of the catalog's. */
  readonly title?: string
  readonly key: Key
  readonly meter: Meter
  readonly tempo: number
  /** The piece's pattern, kept for the Player's Setup; the editor's bars are all written (ADR 0091). */
  readonly pattern: PatternId
  readonly sections: readonly DraftSection[]
  /** Whether the score has the tune's staff over the grand staff (ADR 0064): kept though empty (ADR 0072). */
  readonly melodyStaff: boolean
  /** A lead sheet: the piano's staves out of sight, their music kept (ADR 0072, 0083). */
  readonly leadSheet: boolean
  /** One line: no note starts under another. */
  readonly melody: readonly DraftNote[]
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
  const { chart, melody } = readMusic(music)
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
    tempo: music.tempo,
    pattern: music.pattern,
    sections,
    // The tune's staff is there wherever the music writes a line for it, rests alone included.
    melodyStaff: music.melody !== undefined,
    leadSheet: music.leadSheet === true,
    melody: melody ?? [],
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

/**
 * The notes the words go under (ADR 0093): the tune's where the score has its staff, else the right
 * hand's, a chord of them one note.
 */
export const tuneNotes = (draft: Draft): DraftNote[] =>
  draft.melodyStaff ? [...draft.melody] : singingNotes(draft.hands.rh)

/** The draft as the content writes music: every bar of both hands written (ADR 0091), its words as verses. */
export function writeDraft(draft: Draft): PieceMusic {
  const placed = barsOf(draft)
  const timeline = placed.map(({ start, bar }) => ({ startTick: start, ticks: bar.ticks }))
  // A staff the score has is written though empty, as a rest, so it stays (ADR 0072).
  const melody = draft.melodyStaff
    ? (writeMelody(draft.melody, timeline) ?? emptyLine(timeline))
    : undefined
  const ticks = placed.map(({ bar }) => bar.ticks)
  const clefs = (hand: Hand) => placed.map(({ bar }) => bar.clefs?.[hand])
  const lyrics = gatherLyrics(tuneNotes(draft)).map(writeLyrics)
  return {
    ...(draft.title === undefined ? {} : { title: draft.title }),
    key: keyText(draft.key),
    meter: draft.meter,
    tempo: draft.tempo,
    pattern: draft.pattern,
    sections: draft.sections.map((section) => ({
      ...section.heading,
      lines: section.lines.map((line) =>
        line.map((bar) => writeBar(chartBar(bar), draft.meter)).join(' '),
      ),
    })),
    ...(melody === undefined ? {} : { melody }),
    ...(draft.leadSheet ? { leadSheet: true } : {}),
    ...(lyrics.length > 0 ? { lyrics } : {}),
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
