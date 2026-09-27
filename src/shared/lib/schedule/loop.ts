import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { schedule, type Audible, type Scheduled } from './schedule'

/** Speed training: each pass `step` BPM faster, up to `until`. */
export interface SpeedUp {
  readonly step: number
  readonly until: number
}

/** How Listen loops: a passage (the loop, or the whole piece), the first pass from the cursor. */
export interface LoopOptions {
  readonly hands: Audible
  /** The first pass's tempo. */
  readonly tempo: number
  readonly range: { readonly from: Tick; readonly to: Tick }
  /** Where the first pass starts, inside the range. */
  readonly fromTick: Tick
  readonly speedUp?: SpeedUp | undefined
  readonly countIn?: boolean
  readonly metronome?: boolean
  readonly swing?: boolean
}

/** One pass queued on the audio clock: its sounds, cues and end count from `start`, at its tempo. */
export interface Pass extends Scheduled {
  readonly start: number
  readonly tempo: number
}

/** Listen's loop (spec §2.7): passes of the passage, each queued as the last one nears its end. */
export interface Loop {
  readonly performance: Performance
  readonly options: LoopOptions
  /** The passes queued and not yet over, in time order. */
  readonly passes: readonly Pass[]
  /** How many passes have been queued, the first counting 0. */
  readonly queued: number
}

/** The next pass is queued this long before the last one ends, so the loop never gaps. */
const LOOP_LEAD = 0.5

const endOf = (pass: Pass): number => pass.start + pass.end

function passAt(
  performance: Performance,
  options: LoopOptions,
  index: number,
  start: number,
): Pass {
  const first = index === 0
  const tempo = options.speedUp
    ? Math.min(options.speedUp.until, options.tempo + index * options.speedUp.step)
    : options.tempo
  return {
    ...schedule(performance, {
      tempo,
      hands: options.hands,
      fromTick: first ? options.fromTick : options.range.from,
      toTick: options.range.to,
      countIn: first && options.countIn === true,
      metronome: options.metronome === true,
      swing: options.swing === true,
    }),
    start,
    tempo,
  }
}

/** A loop whose first pass plays from `start` on the audio clock. */
export const startLoop = (performance: Performance, options: LoopOptions, start: number): Loop => ({
  performance,
  options,
  passes: [passAt(performance, options, 0, start)],
  queued: 1,
})

/**
 * The loop at `time` on the clock: passes that are over are dropped, and the next is queued once the
 * last is within LOOP_LEAD of its end. The same loop while nothing changes.
 */
export function advanceLoop(loop: Loop, time: number): Loop {
  const last = loop.passes.at(-1)
  const next =
    last && time >= endOf(last) - LOOP_LEAD
      ? [passAt(loop.performance, loop.options, loop.queued, endOf(last))]
      : []
  const passes = [...loop.passes.filter((pass) => endOf(pass) > time), ...next]
  return next.length === 0 && passes.length === loop.passes.length
    ? loop
    : { ...loop, passes, queued: loop.queued + next.length }
}

/** The beat group sounding at `time` on the clock, or null before the music starts. */
export function beatGroupAt(loop: Loop, time: number): number | null {
  let sounding: number | null = null
  for (const pass of loop.passes) {
    for (const cue of pass.cues) if (pass.start + cue.at <= time) sounding = cue.beatGroup
  }
  return sounding
}

/** The tempo of the pass sounding at `time`, or null before any has started. */
export function tempoAt(loop: Loop, time: number): number | null {
  return loop.passes.findLast((pass) => pass.start <= time)?.tempo ?? null
}
