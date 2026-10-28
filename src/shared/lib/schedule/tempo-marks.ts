import { TICKS_PER_BEAT, type NoteMarks, type Tick } from '@/shared/lib/music'

/** How far rit., rall. and accel. move the tempo, and over how many ticks they get there. */
const SLOWER = 0.75
const FASTER = 1.25
const CHANGE_TICKS = 2 * TICKS_PER_BEAT
/** The warp is summed in steps of a 32nd. */
const STEP = TICKS_PER_BEAT / 8

type Marked = readonly { readonly startTick: Tick; readonly marks?: NoteMarks }[]

/**
 * Where a note marks the tempo to move: a tempo mark sets it at once (a factor of the written tempo),
 * rit., rall., accel. and string. move it from there over two beats, riten. holds it back at once, a
 * tempo brings back the last mark's.
 */
interface TempoChange {
  readonly tick: Tick
  readonly kind: 'mark' | 'move' | 'held' | 'back'
  readonly target: number
}

function tempoChanges(notes: Marked, written: number | undefined): TempoChange[] {
  return notes
    .flatMap((n): TempoChange[] => {
      const changes: TempoChange[] = []
      const tempo = n.marks?.tempo
      if (tempo !== undefined && written !== undefined && written > 0)
        changes.push({ tick: n.startTick, kind: 'mark', target: tempo / written })
      const expression = n.marks?.expression
      if (expression === 'rit' || expression === 'rall')
        changes.push({ tick: n.startTick, kind: 'move', target: SLOWER })
      else if (expression === 'accel' || expression === 'stringendo')
        changes.push({ tick: n.startTick, kind: 'move', target: FASTER })
      else if (expression === 'riten')
        changes.push({ tick: n.startTick, kind: 'held', target: SLOWER })
      else if (expression === 'a-tempo')
        changes.push({ tick: n.startTick, kind: 'back', target: 1 })
      return changes
    })
    .sort((a, b) => a.tick - b.tick)
}

/**
 * The tempo's factor at a tick: a mark's at once, a rit.'s or an accel.'s moving from the one before
 * to its share of the last mark's over CHANGE_TICKS, a tempo the last mark's again.
 */
function factorAt(changes: readonly TempoChange[], tick: Tick): number {
  let base = 1
  let factor = 1
  for (const change of changes) {
    if (change.tick > tick) break
    if (change.kind === 'mark') {
      base = change.target
      factor = base
    } else if (change.kind === 'back') factor = base
    else if (change.kind === 'held') factor = base * change.target
    else {
      const along = Math.min(1, (tick - change.tick) / CHANGE_TICKS)
      factor = factor + (base * change.target - factor) * along
    }
  }
  return factor
}

/** A step's factor, as the warp sums it: the tempo halfway through the 32nd. */
const stepFactor = (changes: readonly TempoChange[], step: number): number =>
  factorAt(changes, step * STEP + STEP / 2)

/**
 * Where a tick falls once the tempo its notes mark (ADR 0097) is followed, in ticks at the written
 * tempo (`written`, beats a minute): a tempo mark changes it at once; rit. and rall. slow to three
 * quarters of it over two beats, accel. presses on to five quarters, each held until a tempo brings
 * the last mark's back. Without such a mark, each tick is where it was.
 */
export function tempoWarp(notes: Marked, written?: number): (tick: Tick) => number {
  const changes = tempoChanges(notes, written)
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
export function tempoSteps(notes: Marked, written?: number): TempoStep[] {
  const changes = tempoChanges(notes, written)
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
