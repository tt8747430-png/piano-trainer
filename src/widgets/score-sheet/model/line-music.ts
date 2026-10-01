import { barsOf, type Draft, type DraftNote, type PlacedBar } from '@/features/score-editor'
import {
  beatsPerBar,
  chordSymbol,
  TICKS_PER_BEAT,
  timeSignature,
  type TimeSignature,
} from '@/shared/lib/music'
import type { StaffId, TimedMusic, TimedNote } from '@/shared/lib/notation'

/** One line of the chart: its section, its place there, and its bars. */
export interface SheetLineBars {
  readonly section: number
  readonly line: number
  readonly bars: readonly PlacedBar[]
  /** Where it starts on the piece's timeline. */
  readonly start: number
}

export function linesOf(draft: Draft): SheetLineBars[] {
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

const endOf = (line: SheetLineBars) => {
  const last = line.bars.at(-1)
  return last ? last.start + last.bar.ticks : line.start
}

/** A voice's notes sounding in [from, to), timed from `from`. */
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
      roll: 0,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
    }))
}

/**
 * A line as the sheet writes it, from its own start: the melody and the written right hand on the
 * treble staff, the written left hand on the bass, the chord symbols; a staff with nothing in a bar is
 * left blank there.
 */
export function lineMusic(draft: Draft, line: SheetLineBars): TimedMusic {
  const from = line.start
  const to = endOf(line)
  const notes = [
    ...sounding(draft.melody, 'melody', from, to),
    ...sounding(draft.hands.rh, 'rh', from, to),
    ...sounding(draft.hands.lh, 'lh', from, to),
  ]
  const bars = line.bars.map(({ start, bar }) => {
    const startTick = start - from
    const holds = (staff: StaffId) =>
      notes.some(
        (n) =>
          (staff === 'bass') === (n.hand === 'lh') &&
          n.startTick < startTick + bar.ticks &&
          n.startTick + n.durationTicks > startTick,
      )
    const blank = (['treble', 'bass'] as const).filter((staff) => !holds(staff))
    return {
      startTick,
      beats: bar.ticks / TICKS_PER_BEAT,
      ...(blank.length > 0 ? { blank } : {}),
    }
  })
  const chords = line.bars.flatMap(({ start, bar }) =>
    bar.chords.map((chord) => ({
      startTick: start - from + chord.at,
      symbol: chordSymbol(chord.chord),
    })),
  )
  return { key: draft.key, meter: draft.meter, bars, notes, chords }
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
