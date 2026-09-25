import type { Midi } from '@/shared/lib/music'
import { createListeners } from './listeners'
import type { MidiInput, MidiStatus, NoteEvent } from './types'

/** A MidiInput for tests: the test presses the keys and changes the status. */
export interface FakeMidi extends MidiInput {
  press(midi: Midi): void
  release(midi: Midi): void
  setStatus(status: MidiStatus): void
}

export function createFakeMidi(
  status: MidiStatus = { state: 'connected', devices: ['Keyboard'] },
): FakeMidi {
  let current = status
  const notes = createListeners<NoteEvent>()
  const statuses = createListeners<MidiStatus>()
  return {
    connect: async () => current,
    onNote: notes.add,
    onStatus: statuses.add,
    press: (midi) => notes.emit({ midi, on: true, velocity: 100 }),
    release: (midi) => notes.emit({ midi, on: false, velocity: 0 }),
    setStatus(next) {
      current = next
      statuses.emit(next)
    },
  }
}
