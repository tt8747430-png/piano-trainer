import type { Performance } from '@/shared/lib/arrangement'
import type { TimedMusic } from '@/shared/lib/notation'

/**
 * A Performance's bars from `from` up to `to` as music a staff writes, its time starting at the
 * first of them: their bars, notes, chords and pedal, the rest left out. A drill's line, as the board's
 * Exercise prints it: no chord symbol, no staff name and no time signature (A41).
 */
function barsBetween(performance: Performance, from: number, to: number): TimedMusic {
  const start = performance.bars[from]?.startTick ?? 0
  const end = performance.bars[to]?.startTick ?? performance.totalTicks
  const within = (tick: number) => tick >= start && tick < end
  return {
    ...performance,
    plain: true,
    timeHidden: true,
    bars: performance.bars
      .slice(from, to)
      .map((bar) => ({ ...bar, startTick: bar.startTick - start })),
    notes: performance.notes
      .filter((each) => within(each.startTick))
      .map((each) => ({ ...each, startTick: each.startTick - start })),
    chords: performance.chords
      .filter((each) => within(each.startTick))
      .map((each) => ({ ...each, startTick: each.startTick - start })),
    pedal: performance.pedal
      .filter((each) => within(each.tick))
      .map((each) => ({ ...each, tick: each.tick - start })),
  }
}

/** One system of an exercise's opening: its music and the number of its first bar. */
export interface OpeningSystem {
  readonly music: TimedMusic
  readonly from: number
}

/**
 * A Performance's first bars laid in systems (canvas v552, an exercise's page): `count` bars at
 * most, `perSystem` to a system, so the score leads the page at reading size.
 */
export function openingSystems(
  performance: Performance,
  count: number,
  perSystem: number,
): readonly OpeningSystem[] {
  const last = Math.min(count, performance.bars.length)
  const systems: OpeningSystem[] = []
  for (let from = 0; from < last; from += perSystem)
    systems.push({ music: barsBetween(performance, from, Math.min(from + perSystem, last)), from })
  return systems
}
