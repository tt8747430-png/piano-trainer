import type { RecordingPlay } from '@/shared/lib/schedule'

/** What the recording player needs of an audio element. */
export interface Media {
  currentTime: number
  playbackRate: number
  muted: boolean
  readonly paused: boolean
  play(): Promise<void>
  pause(): void
}

export interface RecordingPlayer {
  /** Makes the recording's element, so a play can start it at once. */
  load(src: string): void
  /** Queues a play; it starts when the clock reaches its `at`. */
  play(src: string, play: RecordingPlay): void
  /** Inside a gesture: plays each loaded recording muted and pauses it, so it may play later without one. */
  prime(): void
  /** Pauses every recording and forgets what is queued. */
  stop(): void
}

/** How often the player looks at the clock, and how far a recording may drift before it is sought back. */
const TICK_MS = 20
const DRIFT = 0.04

interface Queued extends RecordingPlay {
  readonly src: string
}

/**
 * Recordings kept on the audio clock: each queued play starts as the clock reaches it (sought to its
 * offset, at its rate), is sought back whenever it drifts, and is paused at its end unless another
 * play follows, which only seeks it.
 */
export function createRecordingPlayer({
  now,
  createMedia,
  route,
}: {
  now: () => number
  createMedia: (src: string) => Media
  /** Sends an element to the output, so it leaves with the notes: once, when it first plays (an AudioContext waits for a gesture). */
  route: (media: Media) => void
}): RecordingPlayer {
  const elements = new Map<string, Media>()
  const routed = new Set<Media>()
  let queue: readonly Queued[] = []
  let current: Queued | null = null
  let timer: ReturnType<typeof setInterval> | null = null

  const element = (src: string): Media => {
    const existing = elements.get(src)
    if (existing) return existing
    const made = createMedia(src)
    elements.set(src, made)
    return made
  }
  const routeOnce = (media: Media) => {
    if (routed.has(media)) return
    routed.add(media)
    route(media)
  }
  // A play the browser refuses (no gesture yet) stays silent.
  const start = (media: Media) => {
    routeOnce(media)
    if (media.paused) media.play().catch(() => undefined)
  }
  const expected = (play: Queued, time: number) => play.offset + (time - play.at) * play.rate

  const tick = () => {
    const time = now()
    const next = queue.filter((play) => play.at <= time).at(-1)
    if (next) {
      queue = queue.filter((play) => play.at > time)
      if (current && current.src !== next.src) element(current.src).pause()
      const media = element(next.src)
      media.playbackRate = next.rate
      media.currentTime = expected(next, time)
      start(media)
      current = next
    } else if (current) {
      const media = element(current.src)
      if (time >= current.until) {
        media.pause()
        current = null
      } else if (Math.abs(media.currentTime - expected(current, time)) > DRIFT) {
        media.currentTime = expected(current, time)
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
        if (!media.paused) continue
        routeOnce(media)
        media.muted = true
        media
          .play()
          .then(() => media.pause())
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
