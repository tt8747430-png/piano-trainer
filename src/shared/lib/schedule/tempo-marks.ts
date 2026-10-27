import { TICKS_PER_BEAT, type NoteMarks, type Tick } from '@/shared/lib/music'

/** How far rit., rall. and accel. move the tempo, and over how many ticks they get there. */
const SLOWER = 0.75
const FASTER = 1.25
const CHANGE_TICKS = 2 * TICKS_PER_BEAT
/** The warp is summed in steps of a 32nd. */
const STEP = TICKS_PER_BEAT / 8

type Marked = readonly { readonly startTick: Tick; readonly marks?: NoteMarks }[]

/** Where a note marks the tempo to move, and the factor of the written tempo it moves to. */
interface TempoChange {
  readonly tick: Tick
  readonly target: number
}

function tempoChanges(notes: Marked): TempoChange[] {
  return notes
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
}

/** The tempo's factor at a tick: moving from the one before to each change's target over CHANGE_TICKS. */
function factorAt(changes: readonly TempoChange[], tick: Tick): number {
  let factor = 1
  for (const change of changes) {
    if (change.tick > tick) break
    const from = factor
    const along = Math.min(1, (tick - change.tick) / CHANGE_TICKS)
    factor = change.target === 1 ? 1 : from + (change.target - from) * along
  }
  return factor
}

/** A step's factor, as the warp sums it: the tempo halfway through the 32nd. */
const stepFactor = (changes: readonly TempoChange[], step: number): number =>
  factorAt(changes, step * STEP + STEP / 2)

/**
 * Where a tick falls once the tempo its notes mark (ADR 0097) is followed, in ticks at the written
 * tempo: rit. and rall. slow to three quarters of it over two beats, accel. presses on to five
 * quarters, each held until a tempo brings the written tempo back. Without such a mark, each tick
 * is where it was.
 */
export function tempoWarp(notes: Marked): (tick: Tick) => number {
  const changes = tempoChanges(notes)
  if (changes.length === 0) return (tick) => tick
  const sums = [0]
  return (tick) => {
    // Before the music (a count-in), the written tempo.
    if (tick <= 0) return tick
    const steps = Math.floor(tick / STEP)
    for (let i = sums.length; i <= steps; i += 1)
      sums.push((sums[i - 1] ?? 0) + STEP / stepFactor(changes, i - 1))
    const base = sums[steps] ?? 0
    return base + (tick - steps * STEP) / factorAt(changes, tick)
  }
}

/** The tempo from a tick on, until the next step: its factor of the written tempo. */
export interface TempoStep {
  readonly tick: Tick
  readonly factor: number
}

/**
 * The tempo its notes mark, step by step as `tempoWarp` follows it: the factor from the music's
 * start, then one at each 32nd where it moves (over a rit.'s, a rall.'s or an accel.'s two beats)
 * or comes back (a tempo). The written tempo alone where nothing marks it.
 */
export function tempoSteps(notes: Marked): TempoStep[] {
  const changes = tempoChanges(notes)
  const last = changes.at(-1)
  if (!last) return [{ tick: 0, factor: 1 }]
  const steps: TempoStep[] = []
  // Past the last change's two beats the tempo holds.
  for (let step = 0; step * STEP <= last.tick + CHANGE_TICKS; step += 1) {
    const factor = stepFactor(changes, step)
    if (factor !== steps.at(-1)?.factor) steps.push({ tick: step * STEP, factor })
  }
  return steps
}
