import type { PatternId } from '@/entities/pattern'
import {
  keyText,
  readMusic,
  writeBar,
  writeHand,
  writeMelody,
  type PieceMusic,
  type Section,
} from '@/entities/piece'
import type { HandNote } from '@/shared/lib/arrangement'
import {
  parseKey,
  TICKS_PER_BEAT,
  type Chord,
  type Finger,
  type Key,
  type Meter,
  type Midi,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'

/** What the editor writes (spec §6.1): the chords, the melody or a hand. */
export const LAYERS = ['chords', 'melody', 'rh', 'lh'] as const
export type Layer = (typeof LAYERS)[number]
export const HANDS = ['rh', 'lh'] as const
export type HandId = (typeof HANDS)[number]

/** A note of the melody or a hand on the piece's timeline. */
export interface DraftNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
}

/** A chord from where it starts in its bar; it lasts until the next one or the barline. */
export interface DraftChord {
  readonly at: Tick
  readonly chord: Chord
  readonly method?: string
}

export interface DraftBar {
  readonly ticks: Tick
  /** In order, the first at 0. */
  readonly chords: readonly DraftChord[]
  /** Whether each hand is written here, not played by the pattern. */
  readonly rh: boolean
  readonly lh: boolean
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
  /** One line: no note starts under another. */
  readonly melody: readonly DraftNote[]
  /** Only in bars the hand writes. */
  readonly hands: Readonly<Record<HandId, readonly DraftNote[]>>
}

const ticksOf = (beats: number): Tick => Math.round(beats * TICKS_PER_BEAT)

/** Music as the editor holds it: it reads as the Player reads it, or throws a ContentError. */
export function readDraft(music: PieceMusic): Draft {
  const key = parseKey(music.key)
  if (!key) throw new RangeError(`The music is in no key: "${music.key}"`)
  const { chart, melody } = readMusic(music)
  const hands: Record<HandId, DraftNote[]> = { rh: [], lh: [] }
  let tick = 0
  const sections = chart.sections.map((section, s) => {
    const { lines: _lines, ...heading } = music.sections[s] ?? { kind: 'verse', lines: [] }
    return {
      heading,
      lines: section.lines.map((line) =>
        line.map((bar): DraftBar => {
          const start = tick
          tick += ticksOf(bar.beats)
          let at = 0
          const chords = bar.chords.map(({ beats, method, ...chord }) => {
            const placed = { at, chord, ...(method ? { method } : {}) }
            at += ticksOf(beats)
            return placed
          })
          for (const hand of HANDS) {
            for (const n of bar.hands?.[hand] ?? []) {
              hands[hand].push({ ...n, startTick: start + n.startTick })
            }
          }
          return {
            ticks: ticksOf(bar.beats),
            chords,
            rh: bar.hands?.rh !== undefined,
            lh: bar.hands?.lh !== undefined,
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
    melody: melody ?? [],
    hands,
  }
}

/** A draft bar as the chart reads it: its chords with their beats. */
function chartBar(bar: DraftBar) {
  return {
    chords: bar.chords.map((chord, i) => ({
      ...chord.chord,
      beats: ((bar.chords[i + 1]?.at ?? bar.ticks) - chord.at) / TICKS_PER_BEAT,
      ...(chord.method ? { method: chord.method } : {}),
    })),
    beats: bar.ticks / TICKS_PER_BEAT,
  }
}

/** A hand's notes bar by bar, from each bar's start: null where the pattern plays. */
function handBars(
  notes: readonly DraftNote[],
  bars: readonly { start: Tick; bar: DraftBar }[],
  hand: HandId,
): (HandNote[] | null)[] {
  return bars.map(({ start, bar }) =>
    bar[hand]
      ? notes
          .filter((n) => n.startTick >= start && n.startTick < start + bar.ticks)
          .map((n) => ({ ...n, startTick: n.startTick - start }))
      : null,
  )
}

/** The draft as the content writes music. */
export function writeDraft(draft: Draft): PieceMusic {
  const placed: { start: Tick; bar: DraftBar }[] = []
  let tick = 0
  for (const section of draft.sections) {
    for (const bar of section.lines.flat()) {
      placed.push({ start: tick, bar })
      tick += bar.ticks
    }
  }
  const melody = writeMelody(
    draft.melody,
    placed.map(({ start, bar }) => ({ startTick: start, ticks: bar.ticks })),
  )
  const ticks = placed.map(({ bar }) => bar.ticks)
  const rh = writeHand(handBars(draft.hands.rh, placed, 'rh'), ticks)
  const lh = writeHand(handBars(draft.hands.lh, placed, 'lh'), ticks)
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
    ...(rh === undefined && lh === undefined
      ? {}
      : { hands: { ...(rh === undefined ? {} : { rh }), ...(lh === undefined ? {} : { lh }) } }),
  }
}
