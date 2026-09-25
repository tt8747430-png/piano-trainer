import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { Performance, Tick } from '@/shared/lib/arrangement'
import { schedule, type Audible, type Scheduled } from '@/shared/lib/schedule'

/** The next pass is queued this long before the sounding one ends, so the loop never gaps. */
const LOOP_LEAD = 0.5
/** How often the transport looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

export interface TransportOptions {
  readonly performance: Performance
  readonly fromTick: Tick
  readonly tempo: number
  readonly hands: Audible
  readonly countIn: boolean
  readonly metronome: boolean
}

interface Pass {
  readonly start: number
  readonly scheduled: Scheduled
}

/**
 * Listen's transport: plays the performance from a tick, then loops it from the top, and reports
 * each beat group as it sounds by following the audio clock. Returns the function that stops it.
 */
export function startTransport(
  audio: AudioOutput,
  { performance, fromTick, countIn, ...options }: TransportOptions,
  onReach: (beatGroup: number) => void,
): () => void {
  const passes: Pass[] = []
  const queue = (scheduled: Scheduled, start: number) => {
    audio.play(scheduled.sounds, start)
    passes.push({ start, scheduled })
  }
  queue(schedule(performance, { ...options, fromTick, countIn }), audio.now() + PLAY_DELAY)

  let reached: number | null = null
  const follow = () => {
    const now = audio.now()
    while (passes.length > 1 && now >= (passes[1]?.start ?? Infinity)) passes.shift()
    const sounding = passes[0]
    if (!sounding) return
    const cue = sounding.scheduled.cues.findLast((c) => c.at <= now - sounding.start)
    if (cue && cue.beatGroup !== reached) {
      reached = cue.beatGroup
      onReach(cue.beatGroup)
    }
    const end = sounding.start + sounding.scheduled.end
    if (passes.length === 1 && now >= end - LOOP_LEAD) {
      queue(schedule(performance, { ...options, fromTick: 0 }), end)
    }
  }
  const timer = setInterval(follow, FOLLOW_INTERVAL_MS)

  return () => {
    clearInterval(timer)
    audio.stop()
  }
}
