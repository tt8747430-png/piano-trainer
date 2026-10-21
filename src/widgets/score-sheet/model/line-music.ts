import {
  barsOf,
  isVoiceLayer,
  type Draft,
  type DraftNote,
  type Layer,
  type NoteLayer,
  type PlacedBar,
} from '@/features/score-editor'
import type { ScoreLayout } from '@/shared/ui/score'
import {
  clefsInForce,
  DEFAULT_INSTRUMENT,
  HOME_CLEF,
  barMarksOf,
  beatsPerBar,
  chordSymbol,
  TICKS_PER_BEAT,
  timeSignature,
  type Instrument,
  type TimeSignature,
} from '@/shared/lib/music'
import {
  EXTRA_VOICES,
  PIANO_STAVES,
  STAVES,
  type ExtraVoice,
  type StaffId,
  type StaffInstruments,
  type TimedMusic,
  type TimedNote,
} from '@/shared/lib/notation'

/** One line of the chart: its section, its place there, and its bars. */
export interface SheetLineBars {
  readonly section: number
  readonly line: number
  readonly bars: readonly PlacedBar[]
  /** Where it starts on the piece's timeline. */
  readonly start: number
}

/**
 * The chart's lines, each section's as written; a line of more than `most` bars (more than a narrow
 * screen holds) cut into as few parts as hold it, as even as they come.
 */
export function linesOf(draft: Draft, most = Infinity): SheetLineBars[] {
  return chartLines(draft).flatMap((line) => {
    const parts = Math.ceil(line.bars.length / most)
    if (parts <= 1) return [line]
    const size = Math.ceil(line.bars.length / parts)
    return Array.from({ length: parts }, (_, part) => {
      const bars = line.bars.slice(part * size, (part + 1) * size)
      return { ...line, bars, start: bars[0]?.start ?? line.start }
    }).filter((each) => each.bars.length > 0)
  })
}

function chartLines(draft: Draft): SheetLineBars[] {
  const lines: SheetLineBars[] = []
  for (const placed of barsOf(draft)) {
    const current = lines.at(-1)
    if (current && current.section === placed.section && current.line === placed.line) {
      lines[lines.length - 1] = { ...current, bars: [...current.bars, placed] }
    } else {
      lines.push({
        section: placed.section,
        line: placed.line,
        bars: [placed],
        start: placed.start,
      })
    }
  }
  return lines
}

/** The whole piece as one line, a panorama's: its sections and lines run on. */
export function oneLine(draft: Draft): SheetLineBars[] {
  const bars = barsOf(draft)
  return bars.length === 0 ? [] : [{ section: 0, line: 0, bars, start: 0 }]
}

const endOf = (line: SheetLineBars) => {
  const last = line.bars.at(-1)
  return last ? last.start + last.bar.ticks : line.start
}

/** A layer's notes sounding in [from, to), timed from `from`. */
function sounding(
  notes: readonly DraftNote[],
  hand: TimedNote['hand'],
  from: number,
  to: number,
): TimedNote[] {
  return notes
    .filter((n) => n.startTick < to && n.startTick + n.durationTicks > from)
    .map((n) => ({
      midi: n.midi,
      spelled: n.spelled,
      hand,
      startTick: n.startTick - from,
      durationTicks: n.durationTicks,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
      ...(n.marks ? { marks: n.marks } : {}),
    }))
}

/**
 * The staff a layer's notes are written on: a more voice's own (ADR 0066), the tune's own where it has
 * one (ADR 0064), the treble or the bass.
 */
export const staffOfHand = (layer: NoteLayer, melodyStaff: boolean): StaffId =>
  isVoiceLayer(layer)
    ? layer
    : layer === 'lh'
      ? 'bass'
      : layer === 'melody' && melodyStaff
        ? 'melody'
        : 'treble'

/**
 * What a click on a staff writes: the tune or a more voice on its own staff, the right hand on the
 * treble, the left on the bass.
 */
export const LAYER_OF_STAFF = {
  melody: 'melody',
  voice2: 'voice2',
  voice3: 'voice3',
  voice4: 'voice4',
  treble: 'rh',
  bass: 'lh',
} as const satisfies Record<StaffId, NoteLayer>

/**
 * The layer a point on a line's bar writes: the chord row over the staves (with chord names), else
 * the staff nearest it, each staff reaching half way to the next.
 */
export function layerAt(y: number, layout: ScoreLayout, chordNames: boolean): Layer {
  if (y < 0 && chordNames) return 'chords'
  const drawn = STAVES.flatMap((staff) => {
    const box = layout.staves[staff]
    return box ? [{ staff, ...box }] : []
  })
  const at = drawn.findLast((each, index) => {
    const above = drawn[index - 1]
    return !above || y >= (above.bottom + each.top) / 2
  })
  return LAYER_OF_STAFF[at?.staff ?? 'treble']
}

/** The staff a layer writes on, as a line's engraving drew it; none for the chord row. */
export function staffOfLayer(
  staves: ScoreLayout['staves'],
  layer: Layer,
): { readonly staff: StaffId; readonly top: number; readonly bottom: number } | undefined {
  if (layer === 'chords') return undefined
  const staff = staffOfHand(layer, staves.melody !== undefined)
  const box = staves[staff]
  return box ? { staff, ...box } : undefined
}

/** The sung staves the sheet shows (ADR 0072): the tune's where the score has it, each voice's, none hidden. */
function shownStaves(draft: Draft): { tune: boolean; voices: ExtraVoice[] } {
  return {
    tune: draft.melodyStaff && !draft.hidden.includes('melody'),
    voices: EXTRA_VOICES.slice(0, draft.voices.length).filter(
      (voice) => !draft.hidden.includes(voice),
    ),
  }
}

/** Each sung staff's instrument where one other than the voice is chosen (ADR 0070). */
function staffInstrumentsOf(
  draft: Draft,
  tune: boolean,
  voiceStaves: readonly ExtraVoice[],
): { staffInstruments?: StaffInstruments } {
  const parts: [StaffId, Instrument | undefined][] = [
    ...(tune ? [['melody', draft.instruments[0]] as [StaffId, Instrument | undefined]] : []),
    ...voiceStaves.map((voice): [StaffId, Instrument | undefined] => [
      voice,
      draft.instruments[EXTRA_VOICES.indexOf(voice) + 1],
    ]),
  ]
  const chosen = Object.fromEntries(
    parts.filter(([, instrument]) => instrument && instrument !== DEFAULT_INSTRUMENT),
  )
  return Object.keys(chosen).length > 0 ? { staffInstruments: chosen } : {}
}

/**
 * A line as the sheet writes it, from its own start: the melody on its staff, each voice shown on
 * its own, the written right hand on the treble staff, the written left hand on the bass, the chord
 * symbols; a staff with nothing in a bar is left blank there, a row hidden is not written at all.
 */
export function lineMusic(draft: Draft, line: SheetLineBars): TimedMusic {
  const from = line.start
  const to = endOf(line)
  const { tune, voices: voiceStaves } = shownStaves(draft)
  const notes = [
    ...(tune ? sounding(draft.melody, 'melody', from, to) : []),
    ...voiceStaves.flatMap((voice) =>
      sounding(draft.voices[EXTRA_VOICES.indexOf(voice)] ?? [], 'melody', from, to).map((n) => ({
        ...n,
        voice,
      })),
    ),
    ...sounding(draft.hands.rh, 'rh', from, to),
    ...sounding(draft.hands.lh, 'lh', from, to),
  ]
  const staves: StaffId[] = [
    ...(tune ? (['melody'] as const) : []),
    ...voiceStaves,
    ...PIANO_STAVES,
  ]
  // A line starts in the clefs its first bar is in; its bars change them after.
  const [first] = line.bars
  const inForce = first
    ? clefsInForce(barsOf(draft).map((placed) => placed.bar))[first.index]
    : undefined
  const bars = line.bars.map(({ start, bar }, index) => {
    const startTick = start - from
    const holds = (staff: StaffId) =>
      notes.some(
        (n) =>
          staffOfHand(n.voice ?? n.hand, tune) === staff &&
          n.startTick < startTick + bar.ticks &&
          n.startTick + n.durationTicks > startTick,
      )
    const blank = staves.filter((staff) => !holds(staff))
    return {
      startTick,
      beats: bar.ticks / TICKS_PER_BEAT,
      ...(blank.length > 0 ? { blank } : {}),
      // The piece's tempo over its first bar.
      ...(index === 0 && start === 0 ? { tempo: draft.tempo } : {}),
      ...barMarksOf(bar),
      ...(index === 0 && inForce && inForce !== HOME_CLEF
        ? { clefs: inForce }
        : bar.clefs
          ? { clefs: bar.clefs }
          : {}),
    }
  })
  const chords = line.bars.flatMap(({ start, bar }) =>
    bar.chords.map((chord) => ({
      startTick: start - from + chord.at,
      symbol: chordSymbol(chord.chord),
    })),
  )
  return {
    key: draft.key,
    meter: draft.meter,
    bars,
    notes,
    chords,
    ...(tune ? { melodyStaff: true } : {}),
    ...(voiceStaves.length > 0 ? { voiceStaves } : {}),
    ...staffInstrumentsOf(draft, tune, voiceStaves),
  }
}

/**
 * The time signature in force where a line begins: the last bar before it (the piece's first bar,
 * when short, counts as the meter's); none before the first line.
 */
export function timeBeforeLine(draft: Draft, line: SheetLineBars): TimeSignature | undefined {
  const index = line.bars[0]?.index ?? 0
  const before = barsOf(draft)[index - 1]
  if (!before) return undefined
  const full = beatsPerBar(draft.meter)
  const beats = before.bar.ticks / TICKS_PER_BEAT
  return timeSignature(before.index === 0 && beats < full ? full : beats, draft.meter)
}
