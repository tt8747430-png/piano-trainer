import { beatsPerBar, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { ClickSound } from '@/shared/lib/schedule'

export interface ClickPlan {
  /** Each bar of the piece from the take's first, in ticks; the meter's bars follow its end. */
  readonly barTicks: readonly Tick[]
  readonly meter: Meter
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
 * A take's clicks (spec 2026-10-05 §2): a count-in of one bar of the meter's beats (the first
 * accented), then, with the click on, a click on each beat of the piece's bars from the take's first
 * (each bar's first accented), and of the meter's bars past the piece's end, until the take's longest.
 */
export function recorderClicks({
  barTicks,
  meter,
  tempo,
  click,
  longest,
}: ClickPlan): RecorderClicks {
  const beat = 60 / tempo
  const meterBar = beatsPerBar(meter) * TICKS_PER_BEAT
  const countIn: ClickSound[] = Array.from({ length: beatsPerBar(meter) }, (_, i) => ({
    kind: 'click',
    at: i * beat,
    accent: i === 0,
  }))
  const downbeat = countIn.length * beat
  const barStarts: number[] = []
  const clicks: ClickSound[] = []
  let tick: Tick = 0
  for (let bar = 0; (tick / TICKS_PER_BEAT) * beat < longest; bar++) {
    const ticks = barTicks[bar] ?? meterBar
    barStarts.push((tick / TICKS_PER_BEAT) * beat)
    for (let at: Tick = 0; click && at < ticks; at += TICKS_PER_BEAT) {
      const after = ((tick + at) / TICKS_PER_BEAT) * beat
      if (after < longest) clicks.push({ kind: 'click', at: downbeat + after, accent: at === 0 })
    }
    tick += ticks
  }
  return { sounds: [...countIn, ...clicks], downbeat, barStarts }
}
