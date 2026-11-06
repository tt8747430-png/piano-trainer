import type { RecordingPlay } from '@/shared/lib/schedule'

/**
 * A recording's voice on the audio clock (a signalsmith-stretch node's, ADR 0034): it plays the file
 * from a place, at a speed and shifted in pitch apart, from a moment on that clock, and falls silent
 * at another; as loud as told.
 */
export interface RecordingVoice {
  /** From `output` on the audio clock: the file from `input` seconds, at `rate`, `semitones` higher. */
  play(change: {
    readonly output: number
    readonly input: number
    readonly rate: number
    readonly semitones: number
  }): void
  /** Silent from `output` on the audio clock. */
  pause(output: number): void
  /** How loud, 0 to 1. */
  volume(level: number): void
}

interface RecordingPlayer {
  /** Readies a recording, so a play can start it at once. */
  load(src: string): void
  /** Plays it on the audio clock as `play` says, as loud as `volume` says as it plays. */
  play(src: string, play: RecordingPlay, volume?: () => number): void
  /** Silences every recording now and forgets what is queued. */
  stop(): void
}

/** How often the player looks at the clock: a play's volume, and its end. */
const TICK_MS = 50

interface Queued extends RecordingPlay {
  readonly src: string
  readonly volume: (() => number) | undefined
}

/** A play's volume now: 0 to 1, at full where it says none. */
const volumeOf = (play: Queued): number => Math.min(1, Math.max(0, play.volume?.() ?? 1))

/**
 * Recordings on the audio clock (R34, ADR 0034): each play is scheduled on its file's voice as it is
 * queued (or as the voice is ready, a file that has to be fetched first starting late and in place),
 * the voice stretching it to the play's rate and shifting it by its semitones, so a slow pass keeps
 * its pitch and a transposed one follows the music. The latest play falls silent at its end; one that
 * follows takes over where the last left off. A voice that cannot be made leaves the recording silent.
 */
export function createRecordingPlayer({
  now,
  voiceFor,
}: {
  /** The audio clock. */
  now: () => number
  /** A recording's voice, made once (null where it cannot be: no audio, no file). */
  voiceFor: (src: string) => Promise<RecordingVoice | null>
}): RecordingPlayer {
  const voices = new Map<string, Promise<RecordingVoice | null>>()
  const ready = new Map<string, RecordingVoice>()
  let latest: Queued | null = null
  let timer: ReturnType<typeof setInterval> | null = null

  const voice = (src: string) => {
    const known = voices.get(src)
    if (known) return known
    const made = voiceFor(src).then((each) => {
      if (each) ready.set(src, each)
      return each
    })
    voices.set(src, made)
    return made
  }
  /** A play on its voice: from where it should be by now, where it starts late. */
  const schedule = (target: RecordingVoice, play: Queued) => {
    const output = Math.max(play.at, now())
    target.play({
      output,
      input: play.offset + (output - play.at) * play.rate,
      rate: play.rate,
      semitones: play.semitones,
    })
    target.volume(volumeOf(play))
  }
  const tick = () => {
    const play = latest
    if (!play) return
    const target = ready.get(play.src)
    if (target && now() >= play.until) {
      target.pause(play.until)
      latest = null
    } else target?.volume(volumeOf(play))
    if (!latest && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    load: (src) => void voice(src),
    play(src, play, volume) {
      const queued: Queued = { ...play, src, volume }
      const before = latest
      latest = queued
      if (before && before.src !== src) ready.get(before.src)?.pause(play.at)
      void voice(src).then((target) => {
        if (target && latest === queued) schedule(target, queued)
      })
      timer ??= setInterval(tick, TICK_MS)
    },
    stop() {
      latest = null
      const time = now()
      for (const target of ready.values()) target.pause(time)
      if (timer !== null) clearInterval(timer)
      timer = null
    },
  }
}
