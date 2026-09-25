import type { AudioOutput } from '@/shared/api/audio'
import type { MidiInput } from '@/shared/api/midi'

/** The audio and MIDI ports the app hands down. `midi` is null where the browser has no Web MIDI. */
export interface Services {
  readonly audio: AudioOutput
  readonly midi: MidiInput | null
}
