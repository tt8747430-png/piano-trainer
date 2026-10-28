import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { passTickAt } from './playhead'
import { schedule, type Audible, type Scheduled, type Sound } from './schedule'
import type { SwingFeel } from './swing'

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
  /** Whether the count-in and the metronome click: a count-in still counts without (ADR 0105). */
  readonly clicks?: boolean
  readonly swing?: SwingFeel
  /**
   * Beats of rest before each repeat, a click on each where the clicks sound (the reference app's
   * ticks between loops): a breath to reset the hand before the passage comes round again.
   */
  readonly rest?: number
}

/** One pass queued on the audio clock: its sounds, cues and end count from `start`, at its tempo. */
export interface Pass extends Scheduled {
  readonly start: number
  readonly tempo: number
}

/** Listen's loop: passes of the passage, each queued as the last one nears its end. */
interface Loop {
  readonly performance: Performance
  readonly options: LoopOptions
  /** The passes queued and not yet over, in time order. */
  readonly passes: readonly Pass[]
  /** How many passes have been queued, the first counting 0. */
  readonly queued: number
}

/** The next pass is queued this long before the last one ends, so the loop never gaps. */
const LOOP_LEAD = 0.5

/** A pass queued late (the page's timers slept past the last one's end) starts this soon after. */
const LATE_START = 0.1

const endOf = (pass: Pass): number => pass.start + pass.end

/**
 * A pass with `beats` of rest before it: its music moved on by them, each beat a click where the
 * clicks sound, counted down as a count-in is.
 */
function rested(pass: Scheduled, beats: number, tempo: number, clicks: boolean): Scheduled {
  if (beats <= 0) return pass
  const beat = 60 / tempo
  const lead = beats * beat
  const counts = Array.from({ length: beats }, (_, at) => at * beat)
  const later = <T extends { readonly at: number }>(timed: T): T => ({
    ...timed,
    at: timed.at + lead,
  })
  const ticks: Sound[] = clicks
    ? counts.map((at, index) => ({ kind: 'click', at, accent: index === 0 }))
    : []
  return {
    ...pass,
    sounds: [...ticks, ...pass.sounds.map(later)],
    cues: pass.cues.map(later),
    end: pass.end + lead,
    musicStart: pass.musicStart + lead,
    counts: [...counts, ...pass.counts.map((at) => at + lead)],
  }
}

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
  const scheduled = schedule(performance, {
    tempo,
    hands: options.hands,
    fromTick: first ? options.fromTick : options.range.from,
    toTick: options.range.to,
    countIn: first && options.countIn === true,
    metronome: options.metronome === true,
    clicks: options.clicks !== false,
    swing: options.swing ?? 'straight',
  })
  return {
    ...(first ? scheduled : rested(scheduled, options.rest ?? 0, tempo, options.clicks !== false)),
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
 * last is within LOOP_LEAD of its end (or soon, when the clock is already past it: a page whose timers
 * slept never queues a pass in the past). The same loop while nothing changes.
 */
export function advanceLoop(loop: Loop, time: number): Loop {
  const last = loop.passes.at(-1)
  const next =
    last && time >= endOf(last) - LOOP_LEAD
      ? [
          passAt(
            loop.performance,
            loop.options,
            loop.queued,
            Math.max(endOf(last), time + LATE_START),
          ),
        ]
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

/**
 * Where a count-in is at `time` on the clock: the beats of its bar left, the one sounding among them,
 * so its bar is counted down (4 3 2 1); null outside one.
 */
export function countAt(loop: Loop, time: number): number | null {
  for (const pass of loop.passes) {
    if (time >= pass.start + pass.musicStart) continue
    const sounding = pass.counts.findLastIndex((at) => pass.start + at <= time)
    if (sounding >= 0) return pass.counts.length - sounding
  }
  return null
}

/**
 * The tick sounding at `time` on the clock, between its beat groups (`passTickAt`): what the
 * playhead follows. Null before the music starts.
 */
export function tickAt(loop: Loop, time: number): Tick | null {
  const pass = loop.passes.findLast((each) => each.start + (each.cues[0]?.at ?? Infinity) <= time)
  return pass ? passTickAt(pass, time - pass.start) : null
}
