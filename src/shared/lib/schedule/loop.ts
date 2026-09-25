import type { Performance } from '@/shared/lib/arrangement'
import { schedule, type Scheduled, type ScheduleOptions } from './schedule'

/** One pass queued on the audio clock: its sounds, cues and end count from `start`. */
export interface Pass extends Scheduled {
  readonly start: number
}

/**
 * Listen's loop: a first pass from the learner's beat group, then the whole piece again and again,
 * each pass starting as the last one ends (spec §4.4).
 */
export interface Loop {
  /** The passes queued and not yet over, in time order. */
  readonly passes: readonly Pass[]
  /** What every pass after the first plays: the whole piece, without the count-in. */
  readonly fromTop: Scheduled
}

/** The next pass is queued this long before the last one ends, so the loop never gaps. */
const LOOP_LEAD = 0.5

const endOf = (pass: Pass): number => pass.start + pass.end

/** A loop whose first pass plays `options` from `start` on the audio clock. */
export const startLoop = (
  performance: Performance,
  options: ScheduleOptions,
  start: number,
): Loop => ({
  passes: [{ ...schedule(performance, options), start }],
  fromTop: schedule(performance, { ...options, fromTick: 0, countIn: false }),
})

/**
 * The loop at `time` on the clock: passes that are over are dropped, and the next pass is queued once
 * the last one is within LOOP_LEAD of its end. The same loop while nothing changes.
 */
export function advanceLoop(loop: Loop, time: number): Loop {
  const last = loop.passes.at(-1)
  const next =
    last && time >= endOf(last) - LOOP_LEAD ? [{ ...loop.fromTop, start: endOf(last) }] : []
  const passes = [...loop.passes.filter((pass) => endOf(pass) > time), ...next]
  return next.length === 0 && passes.length === loop.passes.length ? loop : { ...loop, passes }
}

/** The beat group sounding at `time` on the clock, or null before the music starts. */
export function beatGroupAt(loop: Loop, time: number): number | null {
  let sounding: number | null = null
  for (const pass of loop.passes) {
    for (const cue of pass.cues) if (pass.start + cue.at <= time) sounding = cue.beatGroup
  }
  return sounding
}
