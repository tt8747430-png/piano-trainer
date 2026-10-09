import { createWebAudioOutput } from '@/shared/api/audio'
import { createWebMidi, hasWebMidi } from '@/shared/api/midi'
import type { Services } from '@/shared/lib/services'

/** The app's one audio output and MIDI port, built once at startup. */
export function createServices(): Services {
  return {
    audio: createWebAudioOutput(),
    midi: hasWebMidi() ? createWebMidi() : null,
  }
}
