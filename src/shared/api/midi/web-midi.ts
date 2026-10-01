import type { Midi } from '@/shared/lib/music'
import { createListeners } from './listeners'
import { parseMidiMessage } from './parse-message'
import type { MidiInput, MidiStatus, NoteEvent } from './types'

export const hasWebMidi = (navigator: Navigator | undefined = globalThis.navigator): boolean =>
  typeof navigator?.requestMIDIAccess === 'function'

const statusOf = (inputs: readonly MIDIInput[]): MidiStatus =>
  inputs.length > 0
    ? { state: 'connected', devices: inputs.map((input) => input.name ?? input.id) }
    : { state: 'no-device' }

/**
 * The Web MIDI adapter: every keyboard plugged in is listened to, and re-hooked when devices change.
 * A keyboard unplugged lets go of the keys it was holding, so no key stays down without a hand.
 */
/** Whether the learner has allowed MIDI on this site: asked without a prompt. */
const midiPermission = async (): Promise<PermissionState> =>
  (await navigator.permissions.query({ name: 'midi' })).state

export function createWebMidiInput(
  requestAccess: () => Promise<MIDIAccess> = () => navigator.requestMIDIAccess(),
  permission: () => Promise<PermissionState> = midiPermission,
): MidiInput {
  const notes = createListeners<NoteEvent>()
  const statuses = createListeners<MidiStatus>()
  let current: MidiStatus | null = null
  const report = (status: MidiStatus) => {
    current = status
    statuses.emit(status)
  }

  // The keys each keyboard holds down, by the keyboard's id.
  const held = new Map<string, Set<Midi>>()

  const listenTo = (input: MIDIInput) => {
    const keys = held.get(input.id) ?? new Set<Midi>()
    held.set(input.id, keys)
    input.onmidimessage = (event) => {
      const note = event.data ? parseMidiMessage(event.data) : null
      if (!note) return
      if (note.on) keys.add(note.midi)
      else keys.delete(note.midi)
      notes.emit(note)
    }
  }

  const letGoOfUnplugged = (inputs: readonly MIDIInput[]) => {
    const present = new Set(inputs.map((input) => input.id))
    for (const [id, keys] of held) {
      if (present.has(id)) continue
      held.delete(id)
      for (const midi of keys) notes.emit({ midi, on: false, velocity: 0 })
    }
  }

  // A port unplugged may leave the map, or stay in it disconnected.
  const hook = (access: MIDIAccess): MidiStatus => {
    const inputs = [...access.inputs.values()].filter((input) => input.state === 'connected')
    letGoOfUnplugged(inputs)
    for (const input of inputs) listenTo(input)
    return statusOf(inputs)
  }

  // Granted once and kept: a second access would hear every key through ports of its own.
  let granted: MIDIAccess | null = null

  const input: MidiInput = {
    async reconnect() {
      // A browser that cannot say (no Permissions API, no `midi` name) waits for the learner's Connect.
      const state = await permission().catch(() => null)
      return state === 'granted' ? input.connect() : null
    },
    async connect() {
      let status: MidiStatus
      try {
        const access = (granted ??= await requestAccess())
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
  return input
}
