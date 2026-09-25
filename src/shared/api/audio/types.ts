import type { Sound } from '@/shared/lib/schedule'

/** Where the app's sound goes. Built once in app/composition-root.ts, reached through useServices(). */
export interface AudioOutput {
  /** On the first user gesture: browsers start audio suspended until one. */
  unlock(): Promise<void>
  /** Plays sounds whose `at` counts from `at` on the audio clock; by default from just after now. */
  play(sounds: readonly Sound[], at?: number): void
  /** Silences what sounds and drops what is queued. */
  stop(): void
  /** The audio clock in seconds; 0 before there is any. */
  now(): number
}

/** How long after now sounds start when no time is given: enough to schedule them all. */
export const PLAY_DELAY = 0.1
