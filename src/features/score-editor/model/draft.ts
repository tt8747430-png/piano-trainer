import type { PatternId } from '@/entities/pattern'
import {
  emptyLine,
  HAND_IDS,
  keyText,
  readMusic,
  writeBar,
  writeHand,
  writeMelody,
  type HandId,
  type HiddenRow,
  type PieceMusic,
  type Section,
} from '@/entities/piece'
import { isOneOf } from '@/shared/lib'
import { EXTRA_VOICES, type ExtraVoice } from '@/shared/lib/notation'
import type { HandNote } from '@/shared/lib/arrangement'
import {
  DEFAULT_INSTRUMENT,
  type Hand,
  type Instrument,
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
  type NoteMarks,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import { barsOf, chordsAt, startsIn, type PlacedBar } from './timeline'

/** What the editor writes (spec §6.1): the chords, the melody, a more voice's (ADR 0066) or a hand. */
export type Layer = 'chords' | 'melody' | ExtraVoice | HandId
/** A layer of notes: the melody or a hand. */
export type NoteLayer = Exclude<Layer, 'chords'>
/** Whether a layer is a hand's (written bar by bar, else the pattern's). */
export const isHandLayer = isOneOf<HandId>(HAND_IDS)
/** Whether a layer is a more voice's, sung with the tune on a staff of its own. */
export const isVoiceLayer = isOneOf<ExtraVoice>(EXTRA_VOICES)
/** A more voice's place in the draft's voices: the second voice's is 0. */
export const voiceIndex = (voice: ExtraVoice): number => EXTRA_VOICES.indexOf(voice)

/** A note of the melody or a hand on the piece's timeline. */
export interface DraftNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
}

/** A chord from where it starts in its bar; it lasts until the next one or the barline. */
export interface DraftChord {
  readonly at: Tick
  readonly chord: Chord
  readonly method?: string
}

/** A bar as the editor holds it: its length, its chords, which hands write it, and its barlines. */
export interface DraftBar extends BarMarks {
  readonly ticks: Tick
  /** In order, the first at 0. */
  readonly chords: readonly DraftChord[]
  /** Whether each hand is written here, not played by the pattern. */
  readonly rh: boolean
  readonly lh: boolean
  /** The clef a hand's staff changes to here (ADR 0069). */
  readonly clefs?: HandClefs
}

export interface DraftSection {
  readonly heading: Omit<Section, 'lines'>
  readonly lines: readonly (readonly DraftBar[])[]
}

/** A piece's music as the editor holds it: bars of chords, and notes on the timeline. */
export interface Draft {
  readonly key: Key
  readonly meter: Meter
  readonly tempo: number
  readonly pattern: PatternId
  readonly sections: readonly DraftSection[]
  /** Whether the score has the tune's staff over the grand staff (ADR 0064): kept though empty (ADR 0072). */
  readonly melodyStaff: boolean
  /** The rows left out of sight, their music kept (ADR 0072). */
  readonly hidden: readonly HiddenRow[]
  /** One line: no note starts under another. */
  readonly melody: readonly DraftNote[]
  /** The more voices' notes, the second voice's first, each staff there once added (ADR 0066). */
  readonly voices: readonly (readonly DraftNote[])[]
  /** What the tune and each more voice are played on (ADR 0070): one more than the voices. */
  readonly instruments: readonly Instrument[]
  /** Only in bars the hand writes. */
  readonly hands: Readonly<Record<HandId, readonly DraftNote[]>>
}

/** Music as the editor holds it: it reads as the Player reads it, or throws where it does not. */
export function readDraft(music: PieceMusic): Draft {
  const key = parseKey(music.key)
  if (!key) throw new RangeError(`The music is in no key: "${music.key}"`)
  const { chart, melody, voices } = readMusic(music)
  const hands: Record<HandId, DraftNote[]> = { rh: [], lh: [] }
  let tick = 0
  // The chart reads a section for each of the music's, in order: the headings are the music's.
  const sections = music.sections.map(({ lines: _lines, ...heading }, s) => {
    return {
      heading,
      lines: (chart.sections[s]?.lines ?? []).map((line) =>
        line.map((bar): DraftBar => {
          const start = tick
          tick += beatsToTicks(bar.beats)
          let at = 0
          const chords = bar.chords.map(({ beats, method, ...chord }) => {
            const placed = { at, chord, ...(method ? { method } : {}) }
            at += beatsToTicks(beats)
            return placed
          })
          for (const hand of HAND_IDS) {
            for (const n of bar.hands?.[hand] ?? []) {
              hands[hand].push({ ...n, startTick: start + n.startTick })
            }
          }
          return {
            ticks: beatsToTicks(bar.beats),
            chords,
            rh: bar.hands?.rh !== undefined,
            lh: bar.hands?.lh !== undefined,
            ...barMarksOf(bar),
            ...(bar.clefs ? { clefs: bar.clefs } : {}),
          }
        }),
      ),
    }
  })
  return {
    key,
    meter: music.meter,
    tempo: music.tempo,
    pattern: music.pattern,
    sections,
    // The tune's staff is there wherever the music writes a line for it, rests alone included.
    melodyStaff: music.melody !== undefined,
    hidden: music.hidden ?? [],
    melody: melody ?? [],
    voices: voices.slice(0, EXTRA_VOICES.length).map((voice) => [...voice]),
    instruments: Array.from(
      { length: Math.min(voices.length, EXTRA_VOICES.length) + 1 },
      (_, i) => music.instruments?.[i] ?? DEFAULT_INSTRUMENT,
    ),
    hands,
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

/** A hand's notes bar by bar, from each bar's start: null where the pattern plays. */
function handBars(
  notes: readonly DraftNote[],
  bars: readonly PlacedBar[],
  hand: HandId,
): (HandNote[] | null)[] {
  return bars.map((placed) =>
    placed.bar[hand]
      ? notes
          .filter((n) => startsIn(n.startTick, placed))
          .map((n) => ({ ...n, startTick: n.startTick - placed.start }))
      : null,
  )
}

/** The draft as the content writes music. */
export function writeDraft(draft: Draft): PieceMusic {
  const placed = barsOf(draft)
  const timeline = placed.map(({ start, bar }) => ({ startTick: start, ticks: bar.ticks }))
  // A staff the score has is written though empty, as a rest, so it stays (ADR 0072).
  const line = (notes: readonly DraftNote[]) => writeMelody(notes, timeline) ?? emptyLine(timeline)
  const melody = draft.melodyStaff ? line(draft.melody) : undefined
  const voices = draft.voices.map(line)
  // No tune, no tune's instrument.
  const tuneInstrument = melody === undefined ? DEFAULT_INSTRUMENT : draft.instruments[0]
  const instruments = [tuneInstrument, ...draft.voices.map((_, i) => draft.instruments[i + 1])].map(
    (instrument) => instrument ?? DEFAULT_INSTRUMENT,
  )
  const hidden = draft.hidden.filter(
    (row) =>
      row === 'chords' ||
      (row === 'melody' ? draft.melodyStaff : voiceIndex(row) < draft.voices.length),
  )
  const ticks = placed.map(({ bar }) => bar.ticks)
  const clefs = (hand: Hand) => placed.map(({ bar }) => bar.clefs?.[hand])
  const rh = writeHand(handBars(draft.hands.rh, placed, 'rh'), ticks, clefs('rh'))
  const lh = writeHand(handBars(draft.hands.lh, placed, 'lh'), ticks, clefs('lh'))
  return {
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
    ...(voices.length > 0 ? { voices } : {}),
    ...(instruments.some((instrument) => instrument !== DEFAULT_INSTRUMENT) ? { instruments } : {}),
    ...(hidden.length > 0 ? { hidden } : {}),
    ...(rh === undefined && lh === undefined
      ? {}
      : { hands: { ...(rh === undefined ? {} : { rh }), ...(lh === undefined ? {} : { lh }) } }),
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
