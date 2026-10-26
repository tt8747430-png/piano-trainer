import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import {
  advanceLoop,
  beatGroupAt,
  countAt,
  recordingPlay,
  startLoop,
  tempoAt,
  tickAt,
  type LoopOptions,
  type Pass,
  type Recording,
} from '@/shared/lib/schedule'
import { mixGain, type Mix } from './mix'

/** How often the transport looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/** Listen's transport as it runs. */
export interface Transport {
  stop(): void
  /**
   * The tick its music sounds at `time` on the audio clock, between the beat groups: what the
   * playhead follows (ADR 0096). Null before the music starts.
   */
  tickAt(time: number): Tick | null
}

/** What the transport tells as it runs. */
interface TransportEvents {
  /** The beat group sounding, each time it changes. */
  readonly reach: (beatGroup: number) => void
  /** Each pass's tempo as it starts. */
  readonly tempo: (tempo: number) => void
  /** The count-in's beats left as each sounds, its bar counted down; null once the music starts. */
  readonly count: (left: number | null) => void
}

/** What plays along with the music, and how loud. */
interface Along {
  /** The piece's recording, played with every pass; null for none. */
  readonly recording: Recording | null
  /** How loud each part plays (ADR 0105), read as each sounds: a change is heard from then on. */
  readonly mix: () => Mix
}

/**
 * Listen's transport: plays the loop's passes on the audio clock, and the piece's recording with
 * every pass when it plays one, each part as loud as the mix says as it sounds, and reports each beat
 * group as it sounds, each pass's tempo as it starts, and its count-in's beats as they are counted.
 */
export function startTransport(
  audio: AudioOutput,
  performance: Performance,
  options: LoopOptions,
  on: TransportEvents,
  { recording, mix }: Along,
): Transport {
  const gain = mixGain(mix)
  const play = (pass: Pass) => {
    audio.play(pass.sounds, pass.start, gain)
    if (recording)
      audio.playRecording(recording.src, recordingPlay(recording, pass), () => mix().recording)
  }
  let loop = startLoop(performance, options, audio.now() + PLAY_DELAY)
  loop.passes.forEach(play)

  let reached: number | null = null
  let tempo: number | null = null
  let counted: number | null = null
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
    const left = countAt(loop, now)
    if (left !== counted) {
      counted = left
      on.count(left)
    }
  }
  const timer = setInterval(follow, FOLLOW_INTERVAL_MS)

  return {
    stop() {
      clearInterval(timer)
      audio.stop()
    },
    tickAt: (time) => tickAt(loop, time),
  }
}
