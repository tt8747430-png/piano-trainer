import { beatsPerBar, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import { barClicks, countInBeats, secondsFor, type GridBar } from './grid'
import type { ClickSound } from './schedule'

export interface ClickPlan {
  /** The piece's bars. */
  readonly bars: readonly GridBar[]
  readonly meter: Meter
  /** The bar the take starts at: its index in `bars`. */
  readonly from: number
  readonly tempo: number
  /** The click goes on after the count-in. */
  readonly click: boolean
  /** How long after the downbeat the take may last, in seconds. */
  readonly longest: number
}

export interface RecorderClicks {
  /** The count-in, then the click, from the first count-in beat (0 s). */
  readonly sounds: readonly ClickSound[]
  /** When the take's first bar starts, after the first count-in beat. */
  readonly downbeat: number
  /** When each bar starts, in seconds after the downbeat, until the take's longest. */
  readonly barStarts: readonly number[]
}

/**
 * A take's clicks (spec 2026-10-05 §2): the Player's count-in before the take's first bar (a pickup
 * comes in on its beat), then, with the click on, a click on each beat of the piece's bars from there
 * (each bar's first accented), and of the meter's bars past the piece's end, until the take's longest.
 */
export function recorderClicks({
  bars,
  meter,
  from,
  tempo,
  click,
  longest,
}: ClickPlan): RecorderClicks {
  const fromTick = bars[from]?.startTick ?? 0
  const counted = countInBeats({ bars, meter }, fromTick)
  /** Seconds after the first count-in beat. */
  const at = (tick: Tick) => secondsFor(tick - (counted[0]?.tick ?? fromTick), tempo)
  /** Seconds after the downbeat. */
  const after = (tick: Tick) => secondsFor(tick - fromTick, tempo)

  // The piece's bars, then the meter's past its end.
  const timeline: GridBar[] = [...bars]
  const beats = beatsPerBar(meter)
  const last = bars.at(-1)
  let end = last ? last.startTick + last.beats * TICKS_PER_BEAT : 0
  while (after(end) < longest) {
    timeline.push({ startTick: end, beats })
    end += beats * TICKS_PER_BEAT
  }
  const music = { bars: timeline, meter }
  const taken = timeline
    .map((bar, index) => ({ index, start: after(bar.startTick) }))
    .filter(({ index, start }) => index >= from && start < longest)

  const clicks = click
    ? taken
        .flatMap(({ index }) => barClicks(music, index))
        .filter(({ tick }) => after(tick) < longest)
    : []
  return {
    sounds: [...counted, ...clicks].map(({ tick, accent }) => ({
      kind: 'click',
      at: at(tick),
      accent,
    })),
    downbeat: at(fromTick),
    barStarts: taken.map(({ start }) => start),
  }
}
