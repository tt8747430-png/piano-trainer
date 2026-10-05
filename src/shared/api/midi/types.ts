import type { Midi } from '@/shared/lib/music'

export type MidiStatus =
  | { readonly state: 'connected'; readonly devices: readonly string[] }
  | { readonly state: 'no-device' }
  | { readonly state: 'denied' }

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

/** The sustain pedal going down or up, at `time` on the page's clock. */
export interface PedalEvent {
  readonly down: boolean
  readonly time: number
}

/** A message the app reads: a key, or the sustain pedal. */
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
}
