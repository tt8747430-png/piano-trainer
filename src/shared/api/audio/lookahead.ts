import type { Sound } from '@/shared/lib/schedule'

export interface Lookahead {
  /** Queues sounds whose `at` counts from `at` on the clock. */
  add(sounds: readonly Sound[], at: number): void
  /** Drops everything queued. */
  clear(): void
  readonly pending: number
}

interface Queued {
  readonly sound: Sound
  readonly at: number
}

/**
 * Hands sounds to `render` only shortly before they are due, so a long piece never builds thousands
 * of audio nodes at once. What falls within `horizon` seconds renders at once; a timer every
 * `interval` ms renders the rest as the clock reaches them, in time order.
 */
export function createLookahead({
  now,
  render,
  horizon = 0.25,
  interval = 25,
}: {
  now: () => number
  render: (sound: Sound, at: number) => void
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
    const until = now() + horizon
    const due = queue.filter((queued) => queued.at < until)
    queue = queue.slice(due.length)
    for (const { sound, at } of due) render(sound, at)
    if (queue.length === 0) stopTimer()
  }

  return {
    add(sounds, at) {
      const added = sounds.map((sound) => ({ sound, at: at + sound.at }))
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
