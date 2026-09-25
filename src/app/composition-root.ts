import { createWebAudioOutput } from '@/shared/api/audio'
import { createWebMidiInput, hasWebMidi } from '@/shared/api/midi'
import type { Services } from '@/shared/lib/services'

/** The app's one audio output and MIDI input, built once at startup. */
export function createServices(): Services {
  return {
    audio: createWebAudioOutput(),
    midi: hasWebMidi() ? createWebMidiInput() : null,
  }
}
