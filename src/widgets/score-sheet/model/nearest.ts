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

/**
 * The empty place a click at `x` on a bar lands on (ADR 0086): a rest, the room after its last note,
 * a bar its row leaves to the pattern; each stretching from just before its own x (the bar's `start`,
 * the first) to the next place's (a note's, whose head is chosen by itself) or the bar's `end`. None
 * between two notes.
 */
export function roomAt(
  places: readonly { readonly tick: Tick; readonly empty: boolean }[],
  x: number,
  xOf: (tick: Tick) => number,
  { start, end, lead }: { start: number; end: number; lead: number },
): Tick | undefined {
  const sorted = [...places].sort((a, b) => a.tick - b.tick)
  return sorted.find((place, i) => {
    if (!place.empty) return false
    const next = sorted[i + 1]
    const from = i === 0 ? start : xOf(place.tick) - lead
    const to = next ? xOf(next.tick) - lead : end
    return x >= from && x < to
  })?.tick
}
