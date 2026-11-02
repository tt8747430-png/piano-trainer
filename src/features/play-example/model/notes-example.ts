import { noteName, type Midi, type Tick } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/** The keys a line of notes plays, each once, marked with its note's name as written. */
export function notesShown(line: TimedMusic): ShownKeys {
  const marks = new Map<Midi, KeyMark>()
  for (const n of line.notes) marks.set(n.midi, { tone: 'scale', label: noteName(n.spelled) })
  return { keys: [...marks.keys()].sort((a, b) => a - b), marks }
}

/** The bar of a line a tick falls in, by its place: the last bar for a tick past its end. */
export function barOf(line: TimedMusic, tick: Tick): number {
  const after = line.bars.findIndex((bar) => bar.startTick > tick)
  return Math.max(0, (after === -1 ? line.bars.length : after) - 1)
}

/** The keys one bar of a line plays, marked as `notesShown` marks a line's: what the keys show as it plays. */
export function barShown(line: TimedMusic, bar: number): ShownKeys {
  const from = line.bars[bar]?.startTick ?? 0
  const to = line.bars[bar + 1]?.startTick ?? Number.POSITIVE_INFINITY
  return notesShown({
    ...line,
    notes: line.notes.filter((n) => n.startTick >= from && n.startTick < to),
  })
}

/** A row of a line's bars, by their places: from its first bar up to the one after its last. */
export interface BarRow {
  readonly from: number
  readonly to: number
}

/**
 * A line's bars laid in rows as a sheet lays them (round 28): as many bars on a row as their notes
 * fit (`room`, in notes struck, each chord one), a bar too full for a row of its own on one anyway.
 */
export function rowsOf(line: TimedMusic, room: number): BarRow[] {
  const struck = line.bars.map((bar, i) => {
    const to = line.bars[i + 1]?.startTick ?? Number.POSITIVE_INFINITY
    const onsets = new Set(
      line.notes
        .filter((n) => n.startTick >= bar.startTick && n.startTick < to)
        .map((n) => n.startTick),
    )
    return Math.max(1, onsets.size)
  })
  const rows: BarRow[] = []
  let from = 0
  let used = 0
  struck.forEach((count, bar) => {
    if (bar > from && used + count > room) {
      rows.push({ from, to: bar })
      from = bar
      used = 0
    }
    used += count
  })
  if (struck.length > 0) rows.push({ from, to: struck.length })
  return rows
}

/** A row of a line's bars as music of its own, from its first tick: its bars, notes and chords. */
export function barsOf(line: TimedMusic, from: number, to: number): TimedMusic {
  const start = line.bars[from]?.startTick ?? 0
  const end = line.bars[to]?.startTick ?? Number.POSITIVE_INFINITY
  const within = (tick: Tick) => tick >= start && tick < end
  return {
    ...line,
    bars: line.bars.slice(from, to).map((bar) => ({ ...bar, startTick: bar.startTick - start })),
    notes: line.notes
      .filter((n) => within(n.startTick))
      .map((n) => ({ ...n, startTick: n.startTick - start })),
    chords: line.chords
      .filter((chord) => within(chord.startTick))
      .map((chord) => ({ ...chord, startTick: chord.startTick - start })),
  }
}
