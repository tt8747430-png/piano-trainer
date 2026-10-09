import type { Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'

/**
 * The keyboards connected (`devices`, by name), or the one chosen `away` (unplugged: nothing is
 * heard until it comes back), none, or MIDI refused.
 */
export type MidiStatus =
  | { readonly state: 'connected'; readonly devices: readonly string[] }
  | { readonly state: 'away'; readonly device: string; readonly devices: readonly string[] }
  | { readonly state: 'no-device' }
  | { readonly state: 'denied' }

/** Which keyboard is heard (null: any), its keys moved by octaves, and whether its pedals read reversed. */
export interface MidiChoice {
  readonly device: string | null
  readonly octaveShift: number
  readonly reversedPedal: boolean
}

/** Every keyboard heard as it plays. */
export const ANY_KEYBOARD: MidiChoice = { device: null, octaveShift: 0, reversedPedal: false }

/**
 * A key going down (`on`) or up, with the velocity the keyboard sent (0–127), at `time`: when it came,
 * in milliseconds on the page's clock (`performance.now()`'s).
 */
export interface NoteEvent {
  readonly midi: Midi
  readonly on: boolean
  readonly velocity: number
  readonly time: number
}

/** A pedal going down or up, at `time` on the page's clock. */
export interface PedalEvent {
  readonly pedal: PedalKind
  readonly down: boolean
  readonly time: number
}

/** A message the app reads: a key, or a pedal. */
export type MidiMessage =
  ({ readonly kind: 'note' } & NoteEvent) | ({ readonly kind: 'pedal' } & PedalEvent)

/** A MIDI keyboard. Built once in app/composition-root.ts; null where the browser has no Web MIDI. */
export interface MidiInput {
  /** Asks for access and listens to every keyboard plugged in, now and later. */
  connect(): Promise<MidiStatus>
  /**
   * Connects without asking where the learner allowed the keyboard before (the app opened again);
   * null, and no prompt, where they have not.
   */
  reconnect(): Promise<MidiStatus | null>
  onNote(listener: (event: NoteEvent) => void): () => void
  onPedal(listener: (event: PedalEvent) => void): () => void
  onStatus(listener: (status: MidiStatus) => void): () => void
  /** The last status, or null before any connect(). */
  current(): MidiStatus | null
  /** Hears as chosen from now: every key and pedal held is let go first. */
  configure(choice: MidiChoice): void
}
