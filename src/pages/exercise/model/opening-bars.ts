import type { Performance } from '@/shared/lib/arrangement'
import type { TimedMusic } from '@/shared/lib/notation'

/**
 * A Performance's first bars as music a staff writes (canvas 185, an exercise's card): its bars,
 * notes, chords and pedal before the cut, the rest left out.
 */
export function openingBars(performance: Performance, count: number): TimedMusic {
  const end = performance.bars[count]?.startTick ?? performance.totalTicks
  return {
    ...performance,
    bars: performance.bars.slice(0, count),
    notes: performance.notes.filter((each) => each.startTick < end),
    chords: performance.chords.filter((each) => each.startTick < end),
    pedal: performance.pedal.filter((each) => each.tick < end),
  }
}
