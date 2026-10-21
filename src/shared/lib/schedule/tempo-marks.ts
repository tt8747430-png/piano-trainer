import { TICKS_PER_BEAT, type NoteMarks, type Tick } from '@/shared/lib/music'

/** How far rit., rall. and accel. move the tempo, and over how many ticks they get there. */
const SLOWER = 0.75
const FASTER = 1.25
const CHANGE_TICKS = 2 * TICKS_PER_BEAT
/** The warp is summed in steps of a 32nd. */
const STEP = TICKS_PER_BEAT / 8

/**
 * Where a tick falls once the tempo its notes mark (ADR 0068) is followed, in ticks at the written
 * tempo: rit. and rall. slow to three quarters of it over two beats, accel. presses on to five
 * quarters, each held until a tempo brings the written tempo back. Without such a mark, each tick
 * is where it was.
 */
export function tempoWarp(
  notes: readonly { readonly startTick: Tick; readonly marks?: NoteMarks }[],
): (tick: Tick) => number {
  const changes = notes
    .flatMap((n) => {
      const expression = n.marks?.expression
      const target =
        expression === 'rit' || expression === 'rall'
          ? SLOWER
          : expression === 'accel'
            ? FASTER
            : expression === 'a-tempo'
              ? 1
              : null
      return target === null ? [] : [{ tick: n.startTick, target }]
    })
    .sort((a, b) => a.tick - b.tick)
  if (changes.length === 0) return (tick) => tick
  // The tempo's factor at a tick: moving from the one before to the change's target over CHANGE_TICKS.
  const factorAt = (tick: Tick): number => {
    let factor = 1
    for (const change of changes) {
      if (change.tick > tick) break
      const from = factor
      const along = Math.min(1, (tick - change.tick) / CHANGE_TICKS)
      factor = change.target === 1 ? 1 : from + (change.target - from) * along
    }
    return factor
  }
  const sums = [0]
  return (tick) => {
    // Before the music (a count-in), the written tempo.
    if (tick <= 0) return tick
    const steps = Math.floor(tick / STEP)
    for (let i = sums.length; i <= steps; i += 1)
      sums.push((sums[i - 1] ?? 0) + STEP / factorAt((i - 1) * STEP + STEP / 2))
    const base = sums[steps] ?? 0
    return base + (tick - steps * STEP) / factorAt(tick)
  }
}
