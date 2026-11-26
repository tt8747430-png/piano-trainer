import { printedNote, type Midi, type Tick } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/** The keys a line of notes plays, each once, marked with its note's name as written. */
export function notesShown(line: TimedMusic): ShownKeys {
  const marks = new Map<Midi, KeyMark>()
  for (const n of line.notes) marks.set(n.midi, { tone: 'scale', label: printedNote(n.spelled) })
  return { keys: [...marks.keys()].sort((a, b) => a - b), marks }
}

/** A line's notes by name in the order they sound, as its head prints them: `C D E F G A B C`. */
export const lineLetters = (line: TimedMusic): string =>
  line.notes
    .toSorted((a, b) => a.startTick - b.startTick)
    .map((n) => printedNote(n.spelled))
    .join(' ')

/** A row of a line's bars, by their places: from its first bar up to the one after its last. */
interface BarRow {
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
