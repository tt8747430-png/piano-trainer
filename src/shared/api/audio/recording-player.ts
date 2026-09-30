import type { RecordingPlay } from '@/shared/lib/schedule'

/** What the recording player needs of an audio element. */
export interface Media {
  currentTime: number
  playbackRate: number
  muted: boolean
  readonly paused: boolean
  readonly seeking: boolean
  play(): Promise<void>
  pause(): void
}

export interface RecordingPlayer {
  /** Makes the recording's element, so a play can start it at once. */
  load(src: string): void
  /** Queues a play; it starts when the clock reaches its `at`. */
  play(src: string, play: RecordingPlay): void
  /**
   * Inside a gesture: plays each loaded recording not yet primed muted and pauses it, so it may play
   * later without one. A play that starts meanwhile keeps the element going.
   */
  prime(): void
  /** Pauses every recording and forgets what is queued. */
  stop(): void
}

/** How often the player looks at the clock, and how far a recording may drift before it is sought back. */
const TICK_MS = 20
const DRIFT = 0.04
/**
 * How long a seek is given to settle before drift is measured again: an element reports its new time
 * at once but moves on only once it has its data, so measuring sooner would seek it again and again.
 * The longest seek it can learn.
 */
const SETTLE = 0.3

interface Queued extends RecordingPlay {
  readonly src: string
}

/**
 * Recordings kept on the clock: each queued play starts as the clock reaches it (sought to its
 * offset, at its rate), is sought back whenever it drifts, is started again when something pauses it
 * (an interruption, a prime that finished late), and is paused at its end unless another play follows,
 * which only seeks it. A seek aims as far ahead as the element stands still after one.
 */
export function createRecordingPlayer({
  now,
  createMedia,
}: {
  /** The time being heard, on the notes' clock. */
  now: () => number
  createMedia: (src: string) => Media
}): RecordingPlayer {
  const elements = new Map<string, Media>()
  // Safari lets an element play without a gesture once one gesture has played it.
  const primed = new WeakSet<Media>()
  let queue: readonly Queued[] = []
  let current: Queued | null = null
  let settledAt = 0
  /**
   * How long the element stands still after a seek before it moves on (WebKit's about 0.1 s,
   * Chrome's under DRIFT), learnt from each seek once it settles. Sought back to where it should be,
   * a slow element would be as far behind again, and sought again and again, the voice stuttering.
   */
  let seekLag = 0
  /** A seek not yet measured. */
  let measuring = false
  let timer: ReturnType<typeof setInterval> | null = null

  const element = (src: string): Media => {
    const existing = elements.get(src)
    if (existing) return existing
    const made = createMedia(src)
    elements.set(src, made)
    return made
  }
  // A play the browser refuses (no gesture yet) stays silent. One that takes over a prime is heard.
  const start = (media: Media) => {
    media.muted = false
    if (media.paused) media.play().catch(() => undefined)
  }
  const playing = (media: Media) => current !== null && elements.get(current.src) === media
  const expected = (play: Queued, time: number) => play.offset + (time - play.at) * play.rate
  const seek = (media: Media, play: Queued, time: number) => {
    media.currentTime = expected(play, time + seekLag)
    settledAt = time + SETTLE
    measuring = true
  }

  const tick = () => {
    const time = now()
    const next = queue.filter((play) => play.at <= time).at(-1)
    if (next) {
      queue = queue.filter((play) => play.at > time)
      if (current && current.src !== next.src) element(current.src).pause()
      const media = element(next.src)
      media.playbackRate = next.rate
      seek(media, next, time)
      start(media)
      current = next
    } else if (current) {
      const media = element(current.src)
      if (time >= current.until) {
        media.pause()
        current = null
      } else if (media.paused) {
        seek(media, current, time)
        start(media)
      } else if (!media.seeking && time >= settledAt) {
        const drift = media.currentTime - expected(current, time)
        if (measuring) {
          // Behind by this much though sought `seekLag` ahead: the seek took that much longer.
          seekLag = Math.min(SETTLE, Math.max(0, seekLag - drift / current.rate))
          measuring = false
        }
        if (Math.abs(drift) > DRIFT) seek(media, current, time)
      }
    }
    if (!current && queue.length === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    load: (src) => void element(src),
    play(src, play) {
      element(src)
      queue = [...queue, { ...play, src }].sort((a, b) => a.at - b.at)
      timer ??= setInterval(tick, TICK_MS)
    },
    prime() {
      for (const media of elements.values()) {
        if (primed.has(media) || !media.paused) continue
        media.muted = true
        media
          .play()
          .then(() => {
            primed.add(media)
            if (!playing(media)) media.pause()
          })
          .catch(() => undefined)
          .finally(() => {
            media.muted = false
          })
      }
    },
    stop() {
      queue = []
      current = null
      for (const media of elements.values()) media.pause()
      if (timer !== null) clearInterval(timer)
      timer = null
    },
  }
}
