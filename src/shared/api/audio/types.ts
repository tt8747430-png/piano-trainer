import type { Midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'

/** One call to `play()`: the port says whether it still sounds (`isPlaying`). */
export interface PlayHandle {
  /** When its last note ends on the audio clock. */
  readonly until: number
}

/** Where the app's sound goes. Built once in app/composition-root.ts, reached through useServices(). */
export interface AudioOutput {
  /** On the first user gesture: browsers start audio suspended until one. */
  unlock(): Promise<void>
  /** Plays sounds whose `at` counts from `at` on the audio clock (by default just after now); returns their play. */
  play(sounds: readonly Sound[], at?: number): PlayHandle
  /** Silences what sounds and drops what is queued: every play stops playing. */
  stop(): void
  /** The audio clock in seconds; 0 before there is any. */
  now(): number
  /** The keys sounding now, whatever played them: the same set until they change. */
  sounding(): ReadonlySet<Midi>
  /** The keys sounding now that were struck last (spotlight): the same set until they change. */
  struck(): ReadonlySet<Midi>
  /** Whether a play has a note sounding or still to come: false once its last note ends or stop() cuts it off. */
  isPlaying(play: PlayHandle): boolean
  /** Calls `onChange` whenever the keys sounding or struck change, a play ends, or stop() runs; returns what stops it. */
  onSounding(onChange: () => void): () => void
}

/** How long after now sounds start when no time is given: enough to schedule them all. */
export const PLAY_DELAY = 0.1
