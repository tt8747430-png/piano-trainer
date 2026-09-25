import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { Performance } from '@/shared/lib/arrangement'
import {
  advanceLoop,
  beatGroupAt,
  startLoop,
  type Pass,
  type ScheduleOptions,
} from '@/shared/lib/schedule'

/** How often the transport looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/**
 * Listen's transport: plays the performance's loop on the audio clock, each pass as the loop queues
 * it, and reports each beat group as it sounds. Returns the function that stops it.
 */
export function startTransport(
  audio: AudioOutput,
  performance: Performance,
  options: ScheduleOptions,
  onReach: (beatGroup: number) => void,
): () => void {
  const play = (pass: Pass) => audio.play(pass.sounds, pass.start)
  let loop = startLoop(performance, options, audio.now() + PLAY_DELAY)
  loop.passes.forEach(play)

  let reached: number | null = null
  const follow = () => {
    const now = audio.now()
    const next = advanceLoop(loop, now)
    next.passes.filter((pass) => !loop.passes.includes(pass)).forEach(play)
    loop = next
    const beatGroup = beatGroupAt(loop, now)
    if (beatGroup !== null && beatGroup !== reached) {
      reached = beatGroup
      onReach(beatGroup)
    }
  }
  const timer = setInterval(follow, FOLLOW_INTERVAL_MS)

  return () => {
    clearInterval(timer)
    audio.stop()
  }
}
