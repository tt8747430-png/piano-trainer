import { midi, PIANO, type Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import { createListeners } from './listeners'
import { parseMidiMessage } from './parse-message'
import {
  ANY_KEYBOARD,
  type MidiInput,
  type MidiStatus,
  type NoteEvent,
  type PedalEvent,
} from './types'

export const hasWebMidi = (navigator: Navigator | undefined = globalThis.navigator): boolean =>
  typeof navigator?.requestMIDIAccess === 'function'

/** Whether the learner has allowed MIDI on this site: asked without a prompt. */
const midiPermission = async (): Promise<PermissionState> =>
  (await navigator.permissions.query({ name: 'midi' })).state

/** The keys a keyboard holds down, and its pedals down. */
interface Holding {
  readonly keys: Set<Midi>
  readonly pedals: Set<PedalKind>
}

const nameOf = (input: MIDIInput) => input.name ?? input.id

/**
 * The Web MIDI adapter: the keyboards chosen (every one plugged in, or the one by its name) are
 * listened to, and re-hooked when devices change; the others are not. Each message keeps the time it
 * came (its event's `timeStamp`, on the page's clock), not the time a handler ran; its key moved by
 * the octaves chosen (one moved off the piano is not heard). A keyboard unplugged, or no longer
 * heard, lets go of the keys it was holding and of its pedals, so nothing stays down without a hand
 * or a foot. One the learner allowed before reconnects without a prompt.
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
  let choice = ANY_KEYBOARD

  // What each keyboard heard holds down, by the keyboard's id.
  const held = new Map<string, Holding>()

  const listenTo = (input: MIDIInput) => {
    const holding = held.get(input.id) ?? { keys: new Set<Midi>(), pedals: new Set<PedalKind>() }
    held.set(input.id, holding)
    input.onmidimessage = (event) => {
      const message = event.data
        ? parseMidiMessage(event.data, event.timeStamp, choice.reversedPedal)
        : null
      if (!message) return
      if (message.kind === 'pedal') {
        const { kind: _kind, ...pedal } = message
        if (pedal.down) holding.pedals.add(pedal.pedal)
        else holding.pedals.delete(pedal.pedal)
        pedals.emit(pedal)
        return
      }
      const { kind: _kind, ...note } = message
      const shifted = note.midi + 12 * choice.octaveShift
      if (shifted < PIANO.from || shifted > PIANO.to) return
      const key = midi(shifted)
      if (note.on) holding.keys.add(key)
      else if (!holding.keys.delete(key)) return
      notes.emit({ ...note, midi: key })
    }
  }

  /** Lets go of what a keyboard held, as it stops being heard. */
  const letGo = (id: string) => {
    const holding = held.get(id)
    if (!holding) return
    held.delete(id)
    const time = performance.now()
    for (const key of holding.keys) notes.emit({ midi: key, on: false, velocity: 0, time })
    for (const pedal of holding.pedals) pedals.emit({ pedal, down: false, time })
  }

  // A port unplugged may leave the map, or stay in it disconnected.
  const hook = (access: MIDIAccess): MidiStatus => {
    const inputs = [...access.inputs.values()].filter((input) => input.state === 'connected')
    const heard = inputs.filter(
      (input) => choice.device === null || nameOf(input) === choice.device,
    )
    const heardIds = new Set(heard.map((input) => input.id))
    for (const id of [...held.keys()]) if (!heardIds.has(id)) letGo(id)
    for (const input of inputs) if (!heardIds.has(input.id)) input.onmidimessage = null
    for (const input of heard) listenTo(input)
    const devices = inputs.map(nameOf)
    if (choice.device !== null && heard.length === 0)
      return { state: 'away', device: choice.device, devices }
    return devices.length > 0 ? { state: 'connected', devices } : { state: 'no-device' }
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
    configure(next) {
      if (
        next.device === choice.device &&
        next.octaveShift === choice.octaveShift &&
        next.reversedPedal === choice.reversedPedal
      )
        return
      for (const id of [...held.keys()]) letGo(id)
      choice = next
      if (granted) report(hook(granted))
    },
    current: () => current,
    onNote: notes.add,
    onPedal: pedals.add,
    onStatus: statuses.add,
  }
  return input
}
