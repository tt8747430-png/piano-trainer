import type { AudioOutput } from '@/shared/api/audio'
import type { ArrangerPort, MidiPort } from '@/shared/api/midi'

/**
 * The audio and MIDI ports the app hands down. `midi` is null where the browser has no Web MIDI;
 * `arranger`, the arranger the Chord player follows, says so itself (`unsupported`).
 */
export interface Services {
  readonly audio: AudioOutput
  readonly midi: MidiPort | null
  readonly arranger: ArrangerPort
}
