import type { Midi } from '@/shared/lib/music'
import type { RecordingPlay, Sound } from '@/shared/lib/schedule'

/** One call to `play()`: the port says whether it still sounds (`isPlaying`). */
export interface PlayHandle {
  /** When its last note ends on the audio clock. */
  readonly until: number
}

/** How a play is shown on the keys. */
export interface PlayOptions {
  /**
   * A hand's play (a tapped or typed key): the keyboard shows the key while the hand holds it, so
   * the port sounds it without counting it among the keys it shows sounding.
   */
  readonly byHand?: boolean
}

/** Where the app's sound goes. Built once in app/composition-root.ts, reached through useServices(). */
export interface AudioOutput {
  /**
   * On a user gesture: resumes audio a browser started or put back in suspension (iOS after a call),
   * and primes each loaded recording once. Does nothing once audio runs and every recording is primed.
   */
  unlock(): Promise<void>
  /** Plays sounds whose `at` counts from `at` on the audio clock (by default just after now); returns their play. */
  play(sounds: readonly Sound[], at?: number, options?: PlayOptions): PlayHandle
  /** Silences what sounds, recordings too, and drops what is queued: every play stops playing. */
  stop(): void
  /** Readies a recording (fetched whole) so a Play can start it at once. */
  loadRecording(src: string): void
  /** Plays a recording from `play.offset` at `play.rate`, from `play.at` on the audio clock until `play.until`. */
  playRecording(src: string, play: RecordingPlay): void
  /** The audio clock in seconds; 0 before there is any. */
  now(): number
  /** The keys the app is sounding now (a hand's play aside): the same set until they change. */
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
