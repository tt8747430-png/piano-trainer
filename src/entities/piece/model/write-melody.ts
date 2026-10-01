import type { Melody } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { pitchText } from './music'
import { beatsText } from './write-chart'

/** A bar's place on the timeline. */
export interface BarSpan {
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
 * A tune as the melody writes it: notes and the rests between them in time order, `|` where a bar line
 * falls between them; nothing for no notes. The tune is one line: no note starts under another.
 */
export function writeMelody(melody: Melody, bars: readonly BarSpan[]): string | undefined {
  if (melody.length === 0) return undefined
  const starts = new Set(bars.map((bar) => bar.startTick).filter((start) => start > 0))
  const tokens: string[] = []
  const at = (tick: Tick, token: string) => {
    if (starts.has(tick)) tokens.push('|')
    tokens.push(token)
  }
  let running: Tick = 0
  for (const n of [...melody].sort((a, b) => a.startTick - b.startTick)) {
    if (n.startTick < running)
      throw new RangeError(`A tune's note at ${n.startTick} starts under another`)
    for (const rest of rests(running, n.startTick, bars)) at(rest.at, `r/${beatsText(rest.ticks)}`)
    at(n.startTick, `${pitchText(n)}/${beatsText(n.durationTicks)}`)
    running = n.startTick + n.durationTicks
  }
  return tokens.join(' ')
}
