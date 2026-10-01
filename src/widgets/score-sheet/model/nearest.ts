import type { Tick } from '@/shared/lib/music'

/** The place drawn nearest a point across the staff: where a click puts the caret. */
export function nearestPlace(
  places: readonly Tick[],
  x: number,
  xOf: (tick: Tick) => number,
): Tick | undefined {
  let best: Tick | undefined
  let distance = Infinity
  for (const place of places) {
    const off = Math.abs(xOf(place) - x)
    if (off < distance) {
      best = place
      distance = off
    }
  }
  return best
}
