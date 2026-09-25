import type { Midi } from '@/shared/lib/music'

export type MidiStatus =
  | { readonly state: 'connected'; readonly devices: readonly string[] }
  | { readonly state: 'no-device' }
  | { readonly state: 'denied' }

/** A key going down (`on`) or up, with the velocity the keyboard sent (0–127). */
export interface NoteEvent {
  readonly midi: Midi
  readonly on: boolean
  readonly velocity: number
}

/** A MIDI keyboard. Built once in app/composition-root.ts; null where the browser has no Web MIDI. */
export interface MidiInput {
  /** Asks for access and listens to every keyboard plugged in, now and later. */
  connect(): Promise<MidiStatus>
  onNote(listener: (event: NoteEvent) => void): () => void
  onStatus(listener: (status: MidiStatus) => void): () => void
  /** The last status, or null before any connect(). */
  current(): MidiStatus | null
}
