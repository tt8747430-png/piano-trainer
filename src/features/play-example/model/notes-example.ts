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
