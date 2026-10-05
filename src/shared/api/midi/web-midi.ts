import type { Midi } from '@/shared/lib/music'
import { createListeners } from './listeners'
import { parseMidiMessage } from './parse-message'
import type { MidiInput, MidiStatus, NoteEvent, PedalEvent } from './types'

export const hasWebMidi = (navigator: Navigator | undefined = globalThis.navigator): boolean =>
  typeof navigator?.requestMIDIAccess === 'function'

const statusOf = (inputs: readonly MIDIInput[]): MidiStatus =>
  inputs.length > 0
    ? { state: 'connected', devices: inputs.map((input) => input.name ?? input.id) }
    : { state: 'no-device' }

/** Whether the learner has allowed MIDI on this site: asked without a prompt. */
const midiPermission = async (): Promise<PermissionState> =>
  (await navigator.permissions.query({ name: 'midi' })).state

/**
 * The Web MIDI adapter: every keyboard plugged in is listened to, and re-hooked when devices change.
 * Each message keeps the time it came (its event's `timeStamp`, on the page's clock), not the time a
 * handler ran. A keyboard unplugged lets go of the keys it was holding and of its pedal, so nothing
 * stays down without a hand or a foot. One the learner allowed before reconnects without a prompt.
 */
export function createWebMidiInput(
  requestAccess: () => Promise<MIDIAccess> = () => navigator.requestMIDIAccess(),
  permission: () => Promise<PermissionState> = midiPermission,
): MidiInput {
  const notes = createListeners<NoteEvent>()
  const pedals = createListeners<PedalEvent>()
  const statuses = createListeners<MidiStatus>()
  let current: MidiStatus | null = null
  const report = (status: MidiStatus) => {
    current = status
    statuses.emit(status)
  }

  // What each keyboard holds down, by the keyboard's id: its keys, and whether its pedal is down.
  const held = new Map<string, { keys: Set<Midi>; pedal: boolean }>()

  const listenTo = (input: MIDIInput) => {
    const holding = held.get(input.id) ?? { keys: new Set<Midi>(), pedal: false }
    held.set(input.id, holding)
    input.onmidimessage = (event) => {
      const message = event.data ? parseMidiMessage(event.data, event.timeStamp) : null
      if (!message) return
      if (message.kind === 'pedal') {
        const { kind: _kind, ...pedal } = message
        holding.pedal = pedal.down
        pedals.emit(pedal)
        return
      }
      const { kind: _kind, ...note } = message
      if (note.on) holding.keys.add(note.midi)
      else holding.keys.delete(note.midi)
      notes.emit(note)
    }
  }

  const letGoOfUnplugged = (inputs: readonly MIDIInput[]) => {
    const present = new Set(inputs.map((input) => input.id))
    const time = performance.now()
    for (const [id, { keys, pedal }] of held) {
      if (present.has(id)) continue
      held.delete(id)
      for (const midi of keys) notes.emit({ midi, on: false, velocity: 0, time })
      if (pedal) pedals.emit({ down: false, time })
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
    onPedal: pedals.add,
    onStatus: statuses.add,
  }
  return input
}
