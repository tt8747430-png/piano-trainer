import { HAND_IDS } from '@/entities/piece'
import {
  barsOf,
  layerStaff,
  lyricsLayer,
  sectionMeter,
  staffLayer,
  type Draft,
  type DraftNote,
  type Layer,
  type NoteLayer,
  type PlacedBar,
} from '@/features/score-editor'
import { breakLine } from '@/shared/lib'
import { barLabels, type BarLabel, type LabelledBar, type ScoreLayout } from '@/shared/ui/score'
import {
  clefsInForce,
  HOME_CLEF,
  barMarksOf,
  parseKey,
  beatsPerBar,
  chordSymbol,
  TICKS_PER_BEAT,
  timeSignature,
  type TimeSignature,
} from '@/shared/lib/music'
import {
  isSingleStaff,
  isStaffId,
  PIANO_STAVES,
  singleStaff,
  staffOf,
  staffPlace,
  type StaffId,
  type TimedMusic,
  type TimedNote,
} from '@/shared/lib/notation'

/** One line of the chart: its section, its place there, its bars and what their labels print. */
export interface SheetLineBars {
  readonly section: number
  readonly line: number
  readonly bars: readonly PlacedBar[]
  /** Where it starts on the piece's timeline. */
  readonly start: number
  /** Each bar's label (ADR 0095): the line's first number, a section's name, the tempo. */
  readonly labels: readonly BarLabel[]
}

type UnlabelledLine = Omit<SheetLineBars, 'labels'>

/** The lines with their bars' labels, read from the piece's bars: each one's section, the tempo over the first. */
function labelled(draft: Draft, lines: readonly UnlabelledLine[]): SheetLineBars[] {
  const bars: LabelledBar[] = barsOf(draft).map((placed) => ({
    section: placed.section,
    ...(placed.index === 0 ? { tempo: draft.tempo } : {}),
  }))
  return lines.map((line) => {
    const first = line.bars[0]?.index ?? 0
    return { ...line, labels: barLabels(bars, first, first + line.bars.length) }
  })
}

/**
 * The chart's lines, each section's as written; a line wider than `room` (a narrow screen's) cut
 * into as few lines as hold it, as even as they come by the bars' `widths` (ADR 0074).
 */
export function linesOf(
  draft: Draft,
  fit?: { readonly room: number; readonly widths: readonly number[] },
): SheetLineBars[] {
  const cut = chartLines(draft).flatMap((line) => {
    if (!fit) return [line]
    const sizes = breakLine(
      line.bars.map((placed) => fit.widths[placed.index] ?? 0),
      fit.room,
    )
    let at = 0
    return sizes.map((size) => {
      const bars = line.bars.slice(at, at + size)
      at += size
      return { ...line, bars, start: bars[0]?.start ?? line.start }
    })
  })
  return labelled(draft, cut)
}

function chartLines(draft: Draft): UnlabelledLine[] {
  const lines: UnlabelledLine[] = []
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
  return bars.length === 0 ? [] : labelled(draft, [{ section: 0, line: 0, bars, start: 0 }])
}

const endOf = (line: SheetLineBars) => {
  const last = line.bars.at(-1)
  return last ? last.start + last.bar.ticks : line.start
}

/** How a layer's notes are timed: a hand's, or a single staff's by its place (ADR 0097). */
const playedBy = (layer: NoteLayer): Pick<TimedNote, 'hand' | 'staff'> =>
  isSingleStaff(layer) ? { hand: 'staff', staff: staffPlace(layer) } : { hand: layer }

/** A layer's notes sounding in [from, to), timed from `from`, with their words where `lyrics` asks. */
function sounding(
  notes: readonly DraftNote[],
  layer: NoteLayer,
  from: number,
  to: number,
  lyrics: boolean,
): TimedNote[] {
  return notes
    .filter((n) => n.startTick < to && n.startTick + n.durationTicks > from)
    .map((n) => ({
      midi: n.midi,
      spelled: n.spelled,
      ...playedBy(layer),
      startTick: n.startTick - from,
      durationTicks: n.durationTicks,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
      ...(n.marks ? { marks: n.marks } : {}),
      ...(lyrics && n.lyrics ? { lyrics: n.lyrics } : {}),
    }))
}

/** The layer a note on the sheet is written in: its single staff's, else its hand's. */
export const layerOfNote = (n: Pick<TimedNote, 'hand' | 'staff'>): NoteLayer =>
  staffLayer(staffOf(n))

/**
 * The layer a point on a line's bar writes: the chord row over the staves (with chord names), else
 * the staff nearest it, each staff reaching half way to the next.
 */
export function layerAt(y: number, layout: ScoreLayout, chordNames: boolean): Layer {
  if (y < 0 && chordNames) return 'chords'
  const drawn = Object.entries(layout.staves)
    .flatMap(([staff, box]) => (box && isStaffId(staff) ? [{ staff, ...box }] : []))
    .sort((a, b) => a.top - b.top)
  const at = drawn.findLast((each, index) => {
    const above = drawn[index - 1]
    return !above || y >= (above.bottom + each.top) / 2
  })
  return staffLayer(at?.staff ?? 'treble')
}

/** The staff a layer writes on, as a line's engraving drew it; none for the chord row. */
export function staffOfLayer(
  staves: ScoreLayout['staves'],
  layer: Layer,
): { readonly staff: StaffId; readonly top: number; readonly bottom: number } | undefined {
  if (layer === 'chords') return undefined
  const staff = layerStaff(layer)
  const box = staves[staff]
  return box ? { staff, ...box } : undefined
}

/**
 * A line as the sheet writes it, from its own start: each single staff's notes on it (ADR 0097), the
 * right hand on the treble staff, the left hand on the bass (every bar written, ADR 0091); the chord
 * symbols; the lyrics under the staff they are on unless the View hides them (`lyrics` off, ADR
 * 0093). A staff with nothing in a bar is left blank there, a row hidden is not written at all: no
 * piano on a lead sheet.
 */
export function lineMusic(draft: Draft, line: SheetLineBars, lyrics = true): TimedMusic {
  const from = line.start
  const to = endOf(line)
  const piano = !draft.leadSheet
  const sung = lyricsLayer(draft)
  const sings = (layer: NoteLayer) => lyrics && sung === layer
  const notes = [
    ...draft.staves.flatMap((staff, place) =>
      sounding(staff.notes, singleStaff(place), from, to, sings(singleStaff(place))),
    ),
    ...(piano
      ? HAND_IDS.flatMap((hand) => sounding(draft.hands[hand], hand, from, to, sings(hand)))
      : []),
  ]
  const staves: StaffId[] = [
    ...draft.staves.map((_, place) => singleStaff(place)),
    ...(piano ? PIANO_STAVES : []),
  ]
  // A line starts in the clefs its first bar is in; its bars change them after.
  const [first] = line.bars
  const inForce = first
    ? clefsInForce(barsOf(draft).map((placed) => placed.bar))[first.index]
    : undefined
  const bars = line.bars.map(({ start, bar, section }, index) => {
    const startTick = start - from
    // A section's own key and meter: its signature and its time printed where it starts (a key
    // change, a change of time, ADR 0095).
    const { key: written, meter } = draft.sections[section]?.heading ?? {}
    const key = written === undefined ? null : parseKey(written)
    const holds = (staff: StaffId) =>
      notes.some(
        (n) =>
          staffOf(n) === staff &&
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
      ...(key ? { key } : {}),
      ...(meter ? { meter } : {}),
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
    ...(draft.timeSymbol ? { timeSymbol: true } : {}),
    bars,
    notes,
    chords,
    ...(draft.staves.length > 0 ? { staves: draft.staves.map(({ clef }) => ({ clef })) } : {}),
    ...(piano ? {} : { piano: false }),
    // A later line goes on from the bars before it: its first bar, short, is no pickup.
    ...(from > 0 ? { continued: true } : {}),
  }
}

/**
 * The time signature in force where a line begins: the last bar before it, in its section's meter
 * (the piece's first bar, when short, counts as its meter's); none before the first line.
 */
export function timeBeforeLine(draft: Draft, line: SheetLineBars): TimeSignature | undefined {
  const index = line.bars[0]?.index ?? 0
  const before = barsOf(draft)[index - 1]
  if (!before) return undefined
  const meter = sectionMeter(draft, before.section)
  const full = beatsPerBar(meter)
  const beats = before.bar.ticks / TICKS_PER_BEAT
  return timeSignature(before.index === 0 && beats < full ? full : beats, meter)
}
