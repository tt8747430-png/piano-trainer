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
  let current: MidiStatus | null = null
  const notes = createListeners<NoteEvent>()
  const statuses = createListeners<MidiStatus>()
  const report = (next: MidiStatus) => {
    current = next
    statuses.emit(next)
  }
  return {
    async connect() {
      const next = current ?? status
      report(next)
      return next
    },
    current: () => current,
    onNote: notes.add,
    onStatus: statuses.add,
    press: (midi) => notes.emit({ midi, on: true, velocity: 100 }),
    release: (midi) => notes.emit({ midi, on: false, velocity: 0 }),
    setStatus: report,
  }
}
