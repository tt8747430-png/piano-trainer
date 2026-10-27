import {
  barTicks,
  beatsBefore,
  beatStarts,
  TICKS_PER_BEAT,
  type Meter,
  type Tick,
} from '@/shared/lib/music'

/** A bar where it starts and how many beats it has: a Performance's bars, a draft's. */
export interface GridBar {
  readonly startTick: Tick
  readonly beats: number
  /** The meter it is counted in, where that is not the piece's (a change of time, ADR 0095). */
  readonly meter?: Meter | undefined
}

/** A piece's bars in its meter: what a count-in and a click follow. */
export interface BarsInMeter {
  readonly bars: readonly GridBar[]
  readonly meter: Meter
}

/** A beat clicked: where, and whether it is accented (a bar's first, a group's first, ADR 0114). */
interface GridBeat {
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

/**
 * The counted beats of a bar's length `ticks` in `meter`, from its start (ADR 0114): the meter's
 * own (2/2's two halves, 5/4's five quarters accented 3+2), cut where a short bar ends, and on past
 * a long one's meter in its last beat's length.
 */
function beatsIn(meter: Meter, ticks: Tick): GridBeat[] {
  const starts = beatStarts(meter)
  const last = starts.at(-1)
  const step = last ? barTicks(meter) - last.tick : TICKS_PER_BEAT
  const beats = starts.filter(({ tick }) => tick < ticks)
  for (let tick = barTicks(meter); tick < ticks; tick += step) beats.push({ tick, accent: false })
  return beats
}

/**
 * A bar's beats on its meter's grid, from where it starts counting: a pickup's from where its bar
 * would begin, on the full bar's beats.
 */
export function barGrid(
  { bars, meter }: BarsInMeter,
  index: number,
): { start: Tick; beats: GridBeat[] } {
  const bar = bars[index]
  if (!bar) return { start: 0, beats: beatsIn(meter, barTicks(meter)) }
  const own = bar.meter ?? meter
  const before = beatsBefore(bars, index, meter)
  return before > 0
    ? {
        start: bar.startTick - Math.round(before * TICKS_PER_BEAT),
        beats: beatsIn(own, barTicks(own)),
      }
    : { start: bar.startTick, beats: beatsIn(own, Math.round(bar.beats * TICKS_PER_BEAT)) }
}

/**
 * A count-in: a bar's worth of beats before `fromTick`, on the beats of the bar it starts in, so the
 * music comes in on its beat wherever it begins (a pickup's too); each bar's first beat is accented.
 */
export function countInBeats(music: BarsInMeter, fromTick: Tick): GridBeat[] {
  const index = music.bars.findLastIndex((candidate) => candidate.startTick <= fromTick)
  if (index < 0) return []
  const { start, beats } = barGrid(music, index)
  const length = music.bars[index]?.meter ?? music.meter
  const full = barTicks(length)
  const earliest = fromTick - full
  // The bar's beats, and the same bar's before it, so a count-in from mid-bar runs back a bar.
  return [-full, 0]
    .flatMap((shift) => beats.map((beat) => ({ ...beat, tick: start + shift + beat.tick })))
    .filter(({ tick }) => tick >= earliest && tick < fromTick)
}

/** A bar's clicks on the meter's grid, from its own start (a pickup's beats only): accented as counted. */
export function barClicks(music: BarsInMeter, index: number): GridBeat[] {
  const bar = music.bars[index]
  if (!bar) return []
  const { start, beats } = barGrid(music, index)
  return beats
    .map((beat) => ({ ...beat, tick: start + beat.tick }))
    .filter(({ tick }) => tick >= bar.startTick)
}
