import type { Midi } from '@/shared/lib/music'
import { keysSoundingAt, keyWindows, type KeyWindow, type Sound } from '@/shared/lib/schedule'

/** Which keys the audio output is sounding: every note played, until it ends or is stopped. */
export interface SoundingKeys {
  /** Notes the output was asked to play from `at` on the clock. */
  add(sounds: readonly Sound[], at: number): void
  /** Nothing sounds any more. */
  clear(): void
  /** The keys sounding at the last look: the same set until they change. */
  current(): ReadonlySet<Midi>
  /** Calls `onChange` each time the keys change; returns what stops it. */
  subscribe(onChange: () => void): () => void
  /** Looks at the clock again. */
  update(): void
}

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
  let looking = false
  const listeners = new Set<() => void>()

  const update = () => {
    const time = now()
    windows = windows.filter((window) => window.to > time)
    const keys = keysSoundingAt(windows, time)
    if (sameKeys(keys, current)) return
    current = keys.size === 0 ? NONE : keys
    for (const listener of listeners) listener()
  }

  const follow = () => {
    if (!frame || looking || windows.length === 0 || listeners.size === 0) return
    looking = true
    frame(() => {
      looking = false
      update()
      follow()
    })
  }

  return {
    add(sounds, at) {
      windows = [...windows, ...keyWindows(sounds, at)]
      update()
      follow()
    },
    clear() {
      windows = []
      update()
    },
    current: () => current,
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
