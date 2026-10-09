import type { Midi } from '@/shared/lib/music'
import type { PedalKind, RecordingPlay, Sound } from '@/shared/lib/schedule'

/** What a hand does to the live voice: what the fake audio records. */
export type LiveEvent =
  | { readonly kind: 'press'; readonly midi: Midi; readonly velocity: number }
  | { readonly kind: 'release'; readonly midi: Midi }
  | { readonly kind: 'pedal'; readonly pedal: PedalKind; readonly down: boolean }

/** One call to `play()`: the port says whether it still sounds (`isPlaying`). */
export interface PlayHandle {
  /** When its last note ends on the audio clock. */
  readonly until: number
}

/** A keyboard's speaker the app's notes can sound on: times on the page's clock, in milliseconds. */
export interface NoteOutput {
  noteOn(midi: Midi, velocity: number, pageTime: number): void
  noteOff(midi: Midi, pageTime: number): void
  /** Drops what is queued, where the output can. */
  clear(): void
}

/** Where the app's sound goes. Built once in app/composition-root.ts, reached through useServices(). */
export interface AudioOutput {
  /**
   * On a user gesture: resumes audio a browser started or put back in suspension (iOS after a call),
   * and primes each loaded recording once. Does nothing once audio runs and every recording is primed.
   */
  unlock(): Promise<void>
  /** Plays sounds whose `at` counts from `at` on the audio clock (by default just after now); returns their play. */
  play(sounds: readonly Sound[], at?: number): PlayHandle
  /**
   * Silences what sounds, recordings too, and drops what is queued: every play stops playing. The
   * live voice is a hand's: a key it holds ends when it is let go.
   */
  stop(): void
  /**
   * The live voice (spec 2026-10-09 §2.1): a key struck at `velocity` (1–127) sounds until it is let
   * go, or on under the pedals; struck again, it stops first.
   */
  press(key: Midi, velocity: number): void
  release(key: Midi): void
  pedal(pedal: PedalKind, down: boolean): void
  /** The pedals now: the same object until one changes. */
  pedals(): Readonly<Record<PedalKind, boolean>>
  /**
   * The scheduled notes sound on `output` instead of the browser (spec 2026-10-09 §3.3): the click
   * and a recording stay in the browser, and so does the live voice; null: the browser again.
   */
  notesTo(output: NoteOutput | null): void
  /** Readies a recording (fetched whole) so a Play can start it at once. */
  loadRecording(src: string): void
  /** Plays a recording from `play.offset` at `play.rate`, from `play.at` on the audio clock until `play.until`. */
  playRecording(src: string, play: RecordingPlay): void
  /** The audio clock in seconds; 0 before there is any. */
  now(): number
  /**
   * What the audio clock was being heard at, at `pageTime` (milliseconds on the page's clock,
   * `performance.now()`'s): where a key struck then falls against what sounded. Before there is any
   * audio clock, the page's own in seconds.
   */
  audioTimeAt(pageTime: number): number
  /** The keys the app's music is sounding now: the same set until they change. */
  sounding(): ReadonlySet<Midi>
  /** The keys sounding now that were struck last (spotlight): the same set until they change. */
  struck(): ReadonlySet<Midi>
  /**
   * The keys the live voice sounds now: a hand's, and the ones the pedals hold after it let go. The
   * same set until they change.
   */
  live(): ReadonlySet<Midi>
  /** Whether a play has a note sounding or still to come: false once its last note ends or stop() cuts it off. */
  isPlaying(play: PlayHandle): boolean
  /**
   * Calls `onChange` whenever the keys sounding or struck change, a play ends, stop() runs or a pedal
   * moves; returns what stops it.
   */
  onSounding(onChange: () => void): () => void
}

/** How long after now sounds start when no time is given: enough to schedule them all. */
export const PLAY_DELAY = 0.1
