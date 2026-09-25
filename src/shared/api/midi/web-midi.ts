import { createListeners } from './listeners'
import { parseMidiMessage } from './parse-message'
import type { MidiInput, MidiStatus, NoteEvent } from './types'

export const hasWebMidi = (navigator: Navigator | undefined = globalThis.navigator): boolean =>
  typeof navigator?.requestMIDIAccess === 'function'

const statusOf = (inputs: readonly MIDIInput[]): MidiStatus =>
  inputs.length > 0
    ? { state: 'connected', devices: inputs.map((input) => input.name ?? input.id) }
    : { state: 'no-device' }

/** The Web MIDI adapter: every keyboard plugged in is listened to, and re-hooked when devices change. */
export function createWebMidiInput(
  requestAccess: () => Promise<MIDIAccess> = () => navigator.requestMIDIAccess(),
): MidiInput {
  const notes = createListeners<NoteEvent>()
  const statuses = createListeners<MidiStatus>()
  let current: MidiStatus | null = null
  const report = (status: MidiStatus) => {
    current = status
    statuses.emit(status)
  }

  const handleMessage = (event: MIDIMessageEvent) => {
    const note = event.data ? parseMidiMessage(event.data) : null
    if (note) notes.emit(note)
  }

  const hook = (access: MIDIAccess): MidiStatus => {
    const inputs = [...access.inputs.values()]
    for (const input of inputs) input.onmidimessage = handleMessage
    return statusOf(inputs)
  }

  return {
    async connect() {
      let status: MidiStatus
      try {
        const access = await requestAccess()
        access.onstatechange = () => report(hook(access))
        status = hook(access)
      } catch {
        status = { state: 'denied' }
      }
      report(status)
      return status
    },
    current: () => current,
    onNote: notes.add,
    onStatus: statuses.add,
  }
}
