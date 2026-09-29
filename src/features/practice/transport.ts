import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { Performance } from '@/shared/lib/arrangement'
import {
  advanceLoop,
  beatGroupAt,
  recordingPlay,
  startLoop,
  tempoAt,
  type LoopOptions,
  type Pass,
  type Recording,
} from '@/shared/lib/schedule'

/** How often the transport looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/**
 * Listen's transport: plays the loop's passes on the audio clock, and the piece's recording with
 * every pass when it plays one, and reports each beat group as it sounds and each pass's tempo as it
 * starts. Returns the function that stops it.
 */
export function startTransport(
  audio: AudioOutput,
  performance: Performance,
  options: LoopOptions,
  on: { readonly reach: (beatGroup: number) => void; readonly tempo: (tempo: number) => void },
  recording: Recording | null,
): () => void {
  const play = (pass: Pass) => {
    audio.play(pass.sounds, pass.start)
    if (recording) audio.playRecording(recording.src, recordingPlay(recording, pass))
  }
  let loop = startLoop(performance, options, audio.now() + PLAY_DELAY)
  loop.passes.forEach(play)

  let reached: number | null = null
  let tempo: number | null = null
  const follow = () => {
    const now = audio.now()
    const next = advanceLoop(loop, now)
    next.passes.filter((pass) => !loop.passes.includes(pass)).forEach(play)
    loop = next
    const beatGroup = beatGroupAt(loop, now)
    if (beatGroup !== null && beatGroup !== reached) {
      reached = beatGroup
      on.reach(beatGroup)
    }
    const sounding = tempoAt(loop, now)
    if (sounding !== null && sounding !== tempo) {
      tempo = sounding
      on.tempo(sounding)
    }
  }
  const timer = setInterval(follow, FOLLOW_INTERVAL_MS)

  return () => {
    clearInterval(timer)
    audio.stop()
  }
}
