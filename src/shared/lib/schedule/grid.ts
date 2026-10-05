import { beatsBefore, beatsPerBar, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'

/** A bar where it starts and how many beats it has: a Performance's bars, a draft's. */
export interface GridBar {
  readonly startTick: Tick
  readonly beats: number
}

/** A piece's bars in its meter: what a count-in and a click follow. */
export interface BarsInMeter {
  readonly bars: readonly GridBar[]
  readonly meter: Meter
}

/** A beat clicked: where, and whether it is a bar's first. */
export interface GridBeat {
  readonly tick: Tick
  readonly accent: boolean
}

export function checkedTempo(tempo: number): number {
  if (!(tempo > 0)) throw new RangeError(`A tempo is beats per minute above 0, not ${tempo}`)
  return tempo
}

/** Ticks to seconds at a tempo, multiplying before dividing so whole beats come out exact. */
export const secondsFor = (ticks: Tick, tempo: number): number =>
  (ticks * 60) / (checkedTempo(tempo) * TICKS_PER_BEAT)

/** A bar's beats on the meter's grid: a pickup counts from where its bar would begin. */
export function barGrid(
  { bars, meter }: BarsInMeter,
  index: number,
): { start: Tick; beats: number } {
  const bar = bars[index]
  if (!bar) return { start: 0, beats: beatsPerBar(meter) }
  const before = beatsBefore(bars, index, meter)
  return before > 0
    ? { start: bar.startTick - before * TICKS_PER_BEAT, beats: beatsPerBar(meter) }
    : { start: bar.startTick, beats: Math.ceil(bar.beats) }
}

/**
 * A count-in: a bar's worth of beats before `fromTick`, on the beats of the bar it starts in, so the
 * music comes in on its beat wherever it begins (a pickup's too); each bar's first beat is accented.
 */
export function countInBeats(music: BarsInMeter, fromTick: Tick): GridBeat[] {
  const index = music.bars.findLastIndex((candidate) => candidate.startTick <= fromTick)
  if (index < 0) return []
  const { start, beats } = barGrid(music, index)
  const earliest = fromTick - beats * TICKS_PER_BEAT
  return Array.from({ length: 2 * beats }, (_, k) => k - beats).flatMap((k) => {
    const tick = start + k * TICKS_PER_BEAT
    return tick >= earliest && tick < fromTick ? [{ tick, accent: (k + beats) % beats === 0 }] : []
  })
}

/** A bar's clicks on the meter's grid, from its own start (a pickup's beats only): its first beat accented. */
export function barClicks(music: BarsInMeter, index: number): GridBeat[] {
  const bar = music.bars[index]
  if (!bar) return []
  const { start, beats } = barGrid(music, index)
  return Array.from({ length: beats }, (_, k) => ({
    tick: start + k * TICKS_PER_BEAT,
    accent: k === 0,
  })).filter(({ tick }) => tick >= bar.startTick)
}
