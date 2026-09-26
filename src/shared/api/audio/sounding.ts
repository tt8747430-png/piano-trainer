import type { Midi } from '@/shared/lib/music'
import {
  keysSoundingAt,
  keysStruckAt,
  keyWindows,
  type KeyWindow,
  type Sound,
} from '@/shared/lib/schedule'
import type { PlayHandle, PlayOptions } from './types'

/** Which keys the audio output is sounding, and which plays still sound: until they end or are stopped. */
export interface SoundingKeys {
  /** Notes the output was asked to play from `at` on the clock; returns their play. A hand's play shows no keys. */
  add(sounds: readonly Sound[], at: number, options?: PlayOptions): PlayHandle
  /** Nothing sounds any more: every play stops playing. */
  clear(): void
  /** The keys sounding at the last look: the same set until they change. */
  current(): ReadonlySet<Midi>
  /** The keys sounding at the last look that were struck last: the same set until they change. */
  struck(): ReadonlySet<Midi>
  /** Whether a play has a note sounding or still to come. */
  isPlaying(play: PlayHandle): boolean
  /** Calls `onChange` whenever the keys or the plays change, or on clear; returns what stops it. */
  subscribe(onChange: () => void): () => void
  /** Looks at the clock again. */
  update(): void
}

/** The play of sounds with no notes, or of sounds nothing could play: it never plays. */
export const NOTHING_PLAYED: PlayHandle = { until: 0 }

const NONE: ReadonlySet<Midi> = new Set()

const sameKeys = (a: ReadonlySet<Midi>, b: ReadonlySet<Midi>) =>
  a.size === b.size && [...a].every((key) => b.has(key))

/**
 * The log both audio adapters keep. With `frame` (the browser's animation frames) it looks at the
 * clock every frame while a note sounds and someone listens; without it, it looks when told.
 */
export function createSoundingKeys({
  now,
  frame,
}: {
  now: () => number
  frame?: (look: () => void) => void
}): SoundingKeys {
  let windows: readonly KeyWindow[] = []
  let current = NONE
  let struck = NONE
  const playing = new Set<PlayHandle>()
  let looking = false
  const listeners = new Set<() => void>()

  /** Looks at the clock; tells the listeners when anything they read changed, or when `stopped`. */
  const look = (stopped: boolean) => {
    const time = now()
    windows = windows.filter((window) => window.to > time)
    const ended = [...playing].filter((play) => play.until <= time)
    for (const play of ended) playing.delete(play)
    const sounding = keysSoundingAt(windows, time)
    const soundingChanged = !sameKeys(sounding, current)
    if (soundingChanged) current = sounding.size === 0 ? NONE : sounding
    const last = keysStruckAt(windows, time)
    const struckChanged = !sameKeys(last, struck)
    if (struckChanged) struck = last.size === 0 ? NONE : last
    if (stopped || ended.length > 0 || soundingChanged || struckChanged)
      for (const listener of listeners) listener()
  }
  const update = () => look(false)

  const follow = () => {
    if (!frame || looking || playing.size === 0 || listeners.size === 0) return
    looking = true
    frame(() => {
      looking = false
      update()
      follow()
    })
  }

  return {
    add(sounds, at, { byHand = false } = {}) {
      const added = keyWindows(sounds, at)
      if (added.length === 0) return NOTHING_PLAYED
      const play: PlayHandle = { until: Math.max(...added.map((window) => window.to)) }
      if (!byHand) windows = [...windows, ...added]
      playing.add(play)
      update()
      follow()
      return play
    },
    clear() {
      windows = []
      const stopped = playing.size > 0
      playing.clear()
      look(stopped)
    },
    current: () => current,
    struck: () => struck,
    isPlaying: (play) => playing.has(play),
    subscribe(onChange) {
      listeners.add(onChange)
      follow()
      return () => {
        listeners.delete(onChange)
      }
    },
    update,
  }
}
