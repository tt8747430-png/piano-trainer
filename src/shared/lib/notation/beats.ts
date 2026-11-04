import { meterBeats, meterOf, type Tick, type TimeSignature } from '@/shared/lib/music'

/** One counted beat of a bar (R29-P16): the bar it is in, where it starts and where it ends. */
export interface BeatMark {
  readonly measure: number
  readonly tick: Tick
  readonly end: Tick
}

/** A stretch of the music's timeline, its end exclusive. */
export interface TickRange {
  readonly from: Tick
  readonly to: Tick
}

type Bar = { readonly startTick: Tick; readonly ticks: Tick; readonly time: TimeSignature }

/**
 * Every bar's counted beats from its own time signature (as a click counts them, `meterBeats`): 4/4
 * four quarters, 3/4 three, 2/4 two, 6/8 two dotted quarters, 7/8 as 2+2+3. A bar shorter than its
 * time (a pickup) keeps the beats that fit, the last cut at its end.
 */
export function beatGrid(measures: readonly Bar[]): BeatMark[] {
  return measures.flatMap((bar, measure) => {
    const meter = meterOf(bar.time.count, bar.time.unit)
    const lengths = meter ? meterBeats(meter) : [bar.ticks]
    const end = bar.startTick + bar.ticks
    const beats: BeatMark[] = []
    let tick = bar.startTick
    for (const length of lengths) {
      if (tick >= end) break
      beats.push({ measure, tick, end: Math.min(end, tick + length) })
      tick += length
    }
    return beats
  })
}

/** A bar's beats, bar line to bar line: what a tap on the bar chooses. */
export function barRange(grid: readonly BeatMark[], measure: number): TickRange | null {
  const beats = grid.filter((beat) => beat.measure === measure)
  const first = beats[0]
  const last = beats.at(-1)
  return first && last ? { from: first.tick, to: last.end } : null
}

/**
 * A range snapped to whole beats (Decided 21): its start down to the start of the beat it falls in,
 * its end up to the end of the beat its last moment falls in.
 */
export function snapRange(range: TickRange, grid: readonly BeatMark[]): TickRange {
  const at = (tick: Tick) => grid.find((beat) => beat.tick <= tick && tick < beat.end)
  const from = at(range.from)?.tick ?? range.from
  const to = at(Math.max(range.from, range.to - 1))?.end ?? range.to
  return { from, to }
}
