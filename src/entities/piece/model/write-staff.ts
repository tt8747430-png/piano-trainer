import type { StaffNote } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { pitchText } from './music'
import { writeMarks } from './note-marks'
import { beatsText } from './write-chart'

/** A bar's place on the timeline. */
interface BarSpan {
  readonly startTick: Tick
  readonly ticks: Tick
}

/** The rests that fill [from, to), cut at the bar lines inside it so each can take its `|`. */
function rests(from: Tick, to: Tick, bars: readonly BarSpan[]): { at: Tick; ticks: Tick }[] {
  if (from >= to) return []
  const cuts = bars.map((bar) => bar.startTick).filter((start) => start > from && start < to)
  return [from, ...cuts].map((at, i) => ({ at, ticks: (cuts[i] ?? to) - at }))
}

/**
 * A single staff's notes as content writes them (ADR 0097): notes and the rests between them in time
 * order, `|` where a bar line falls between them; a staff with nothing written on it yet its first
 * bar's rest, so it is saved and read back as there (ADR 0072). A staff is one line: no note starts
 * under another.
 */
export function writeStaff(notes: readonly StaffNote[], bars: readonly BarSpan[]): string {
  if (notes.length === 0) return `r/${beatsText(bars[0]?.ticks ?? 0)}`
  const starts = new Set(bars.map((bar) => bar.startTick).filter((start) => start > 0))
  const tokens: string[] = []
  const at = (tick: Tick, token: string) => {
    if (starts.has(tick)) tokens.push('|')
    tokens.push(token)
  }
  let running: Tick = 0
  for (const n of [...notes].sort((a, b) => a.startTick - b.startTick)) {
    if (n.startTick < running)
      throw new RangeError(`A staff's note at ${n.startTick} starts under another`)
    for (const rest of rests(running, n.startTick, bars)) at(rest.at, `r/${beatsText(rest.ticks)}`)
    const marks = n.marks ? writeMarks(n.marks) : ''
    at(n.startTick, `${pitchText(n)}/${beatsText(n.durationTicks)}${marks ? `[${marks}]` : ''}`)
    running = n.startTick + n.durationTicks
  }
  return tokens.join(' ')
}
