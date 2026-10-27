import {
  groupTicks,
  isCompound,
  meterBeats,
  meterOf,
  TICKS_PER_BEAT,
  type Meter,
  type Tick,
  type TimeSignature,
} from '@/shared/lib/music'
import type { ScoreEvent } from './types'
import { ticksOf } from './values'

/** Which of a voice's events (by index) are beamed together, and which make a triplet. */
export interface BeamPlan {
  /** Each beam's events, two or more, in order. */
  readonly beams: readonly (readonly number[])[]
  /** Each tuplet's events: a beat of triplets. */
  readonly tuplets: readonly (readonly number[])[]
}

/**
 * The groups a beam of eighths may run over, in ticks from the bar's first beat, in turn (LilyPond's
 * `default-time-signature-settings` and `beatStructure`, ADR 0087, 0114): the half bar in 4/4, the
 * whole bar in 3/4, a half in x/2, 5/4's 3+2 and 6/4's 3+3 quarters, 7/8's 2+2+3 eighths, a dotted
 * quarter in 6/8, 9/8 and 12/8, else the beat.
 */
function eighthsGroups(time: TimeSignature, meter: Meter): Tick[] {
  const own = meterOf(time.count, time.unit)
  if (!own || isCompound(meter) !== isCompound(own)) return [TICKS_PER_BEAT]
  if (time.unit === 4 && time.count === 4) return [2 * TICKS_PER_BEAT]
  if (time.unit === 4 && time.count === 3) return [3 * TICKS_PER_BEAT]
  if (time.unit === 4 && time.count <= 2) return [TICKS_PER_BEAT]
  return time.unit === 4 ? groupTicks(own) : meterBeats(own)
}

/** Which group a tick from the bar's first beat falls in: the groups in turn, the last repeated. */
function groupAt(groups: readonly Tick[], tick: Tick): number {
  let start = 0
  let at = 0
  for (;;) {
    const length = groups[Math.min(at, groups.length - 1)] ?? TICKS_PER_BEAT
    if (tick < start + length) return at
    start += length
    at += 1
  }
}

/** Consecutive indices whose `key` agrees, as runs. */
function runsBy(indices: readonly number[], key: (index: number) => number): number[][] {
  const runs: number[][] = []
  let run: number[] = []
  let last: number | undefined
  for (const index of indices) {
    const at = key(index)
    if (run.length > 0 && (at !== last || index !== (run.at(-1) ?? -2) + 1)) {
      runs.push(run)
      run = []
    }
    run.push(index)
    last = at
  }
  if (run.length > 0) runs.push(run)
  return runs
}

/**
 * A voice's beams and tuplets in a bar, as LilyPond's auto-beaming writes them (ADR 0087): eighths
 * beamed over the meter's groups (`eighthsGroups`), a beam with anything shorter cut at each beat; a
 * rest or a longer note ends a beam; each beat of triplets one tuplet, its eighths beamed. `barStart`
 * is where the bar's first beat falls (before a pickup's music).
 */
export function beamPlan(
  events: readonly ScoreEvent[],
  meter: Meter,
  time: TimeSignature,
  barStart: Tick,
): BeamPlan {
  const at = (index: number) => (events[index]?.tick ?? 0) - barStart
  const beatOf = (index: number) => Math.floor(at(index) / TICKS_PER_BEAT)
  const beamable = (event: ScoreEvent | undefined) =>
    event?.kind === 'notes' && event.duration.value >= 8
  const indices = events.map((_, index) => index)

  const tuplets = runsBy(
    indices.filter((index) => events[index]?.duration.triplet),
    beatOf,
  )
  const tripletBeams = tuplets.flatMap((tuplet) =>
    runsBy(
      tuplet.filter((index) => beamable(events[index])),
      () => 0,
    ),
  )

  const groups = eighthsGroups(time, meter)
  const plain = indices.filter(
    (index) => beamable(events[index]) && !events[index]?.duration.triplet,
  )
  const beams = runsBy(plain, (index) => groupAt(groups, Math.max(0, at(index)))).flatMap((run) =>
    run.some((index) => (events[index]?.duration.value ?? 0) > 8) ? runsBy(run, beatOf) : [run],
  )
  const order = (a: readonly number[], b: readonly number[]) => (a[0] ?? 0) - (b[0] ?? 0)
  return {
    beams: [...beams, ...tripletBeams].filter((beam) => beam.length > 1).sort(order),
    tuplets,
  }
}

/** Where a measure's first beat falls: a pickup's before its music, so its notes keep their beats. */
export const barStartOf = (
  measure: { readonly startTick: Tick; readonly ticks: Tick; readonly time: TimeSignature },
  meter: Meter,
): Tick =>
  measure.startTick +
  measure.ticks -
  measure.time.count * ticksOf({ value: measure.time.unit, dots: 0, triplet: false }, meter)
