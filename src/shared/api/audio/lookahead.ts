import type { Sound } from '@/shared/lib/schedule'
import type { SoundGain } from './types'

interface Lookahead {
  /** Queues sounds whose `at` counts from `at` on the clock, each as loud as `gain` says as it renders. */
  add(sounds: readonly Sound[], at: number, gain?: SoundGain): void
  /** Drops everything queued. */
  clear(): void
  readonly pending: number
}

/** A sound due this long ago is dropped: the page slept past it, and it would sound in a heap. */
const STALE = 1

interface Queued {
  readonly sound: Sound
  readonly at: number
  readonly gain: SoundGain | undefined
}

/**
 * Hands sounds to `render` only shortly before they are due, so a long piece never builds thousands
 * of audio nodes at once, each with its gain asked then (a change of loudness is heard from the next
 * sound rendered). What falls within `horizon` seconds renders at once; a timer every `interval` ms
 * renders the rest as the clock reaches them, in time order; what it reaches long after they were
 * due (a sleeping page's timers) is dropped, not played all at once.
 */
export function createLookahead({
  now,
  render,
  horizon = 0.25,
  interval = 25,
}: {
  now: () => number
  render: (sound: Sound, at: number, gain: number) => void
  horizon?: number
  interval?: number
}): Lookahead {
  let queue: readonly Queued[] = []
  let timer: ReturnType<typeof setInterval> | null = null

  const stopTimer = () => {
    if (timer === null) return
    clearInterval(timer)
    timer = null
  }

  const renderDue = () => {
    const time = now()
    const due = queue.filter((queued) => queued.at < time + horizon)
    queue = queue.slice(due.length)
    for (const { sound, at, gain } of due)
      if (at >= time - STALE) render(sound, at, gain ? gain(sound) : 1)
    if (queue.length === 0) stopTimer()
  }

  return {
    add(sounds, at, gain) {
      const added = sounds.map((sound) => ({ sound, at: at + sound.at, gain }))
      queue = [...queue, ...added].sort((a, b) => a.at - b.at)
      renderDue()
      if (queue.length > 0 && timer === null) timer = setInterval(renderDue, interval)
    },
    clear() {
      queue = []
      stopTimer()
    },
    get pending() {
      return queue.length
    },
  }
}
