import type { NoteOutput } from '@/shared/api/audio'
import { midi, PIANO, type Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import { createListeners } from './listeners'
import { createMidiLog } from './log'
import { parseMidiMessage } from './parse-message'
import {
  ANY_KEYBOARD,
  DEVICE_NAME_MAX,
  type MidiDevice,
  type MidiPort,
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

/** A port's name (its id where it has none, or an empty one), cut to what a setting keeps. */
const nameOf = (port: MIDIPort) => (port.name || port.id).slice(0, DEVICE_NAME_MAX)

const isConnected = (port: MIDIPort) => port.state === 'connected'

/** The devices connected, by name: a device's input and output ports, of one name, are one. */
function devicesOf(access: MIDIAccess): MidiDevice[] {
  const devices = new Map<string, MidiDevice>()
  const add = (port: MIDIPort, input: boolean) => {
    const name = nameOf(port)
    const known = devices.get(name)
    devices.set(name, {
      name,
      manufacturer: known?.manufacturer || port.manufacturer || '',
      input: input || (known?.input ?? false),
      output: !input || (known?.output ?? false),
    })
  }
  for (const port of access.inputs.values()) if (isConnected(port)) add(port, true)
  for (const port of access.outputs.values()) if (isConnected(port)) add(port, false)
  return [...devices.values()]
}

const NOTE_ON = 0x90
const NOTE_OFF = 0x80
/** The velocity a note-off carries. */
const RELEASE_VELOCITY = 64

/** A keyboard's speaker as the app's notes reach it, each message timed on the page's clock. */
function speakerOf(output: MIDIOutput): NoteOutput {
  return {
    noteOn: (key, velocity, pageTime) => output.send([NOTE_ON, key, velocity], pageTime),
    noteOff: (key, pageTime) => output.send([NOTE_OFF, key, RELEASE_VELOCITY], pageTime),
    // Web MIDI's clear() is not in every browser yet: where it is not, what is queued plays out.
    clear: () => {
      if ('clear' in output && typeof output.clear === 'function') output.clear()
    },
  }
}

/**
 * The Web MIDI adapter: the keyboards chosen (every one plugged in, or the one by its name) are
 * listened to, and re-hooked when devices change; the others are not. Each message keeps the time it
 * came (its event's `timeStamp`, on the page's clock), not the time a handler ran; its key moved by
 * the octaves chosen (one moved off the piano is not heard). A keyboard unplugged, or no longer
 * heard, lets go of the keys it was holding and of its pedals, so nothing stays down without a hand
 * or a foot. One the learner allowed before reconnects without a prompt. The chosen keyboard's
 * speaker (the first that has one, for any keyboard) can sound the app's notes. Every keyboard's
 * messages, the ones not heard too, go to the MIDI log. Turned off (`disconnect`), it hears nothing
 * until it connects again.
 */
export function createWebMidi(
  requestAccess: () => Promise<MIDIAccess> = () => navigator.requestMIDIAccess(),
  permission: () => Promise<PermissionState> = midiPermission,
): MidiPort {
  const notes = createListeners<NoteEvent>()
  const pedals = createListeners<PedalEvent>()
  const statuses = createListeners<MidiStatus>()
  let current: MidiStatus | null = null
  const report = (status: MidiStatus) => {
    current = status
    statuses.emit(status)
  }
  let choice = ANY_KEYBOARD
  const log = createMidiLog()
  let devices: readonly MidiDevice[] = []

  // What each keyboard heard holds down, by the keyboard's id.
  const held = new Map<string, Holding>()

  /** A keyboard not heard: its messages go to the log only. */
  const logOnly = (input: MIDIInput) => {
    input.onmidimessage = (event) => {
      if (event.data) log.add(nameOf(input), event.data, event.timeStamp)
    }
  }

  const listenTo = (input: MIDIInput) => {
    const holding = held.get(input.id) ?? { keys: new Set<Midi>(), pedals: new Set<PedalKind>() }
    held.set(input.id, holding)
    input.onmidimessage = (event) => {
      if (event.data) log.add(nameOf(input), event.data, event.timeStamp)
      const message = event.data
        ? parseMidiMessage(event.data, event.timeStamp, choice.reversedPedal, holding.pedals)
        : null
      if (!message) return
      if (message.kind === 'pedal') {
        const { kind: _kind, ...pedal } = message
        // A pedal's stream of values says down, or up, once.
        if (pedal.down === holding.pedals.has(pedal.pedal)) return
        if (pedal.down) holding.pedals.add(pedal.pedal)
        else holding.pedals.delete(pedal.pedal)
        pedals.emit(pedal)
        return
      }
      if (message.kind === 'all-off') {
        for (const key of holding.keys)
          notes.emit({ midi: key, on: false, velocity: 0, time: message.time })
        holding.keys.clear()
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
    for (const input of inputs) if (!heardIds.has(input.id)) logOnly(input)
    for (const input of heard) listenTo(input)
    devices = devicesOf(access)
    // A keyboard is chosen by its name: two of one name are one choice.
    const names = [...new Set(inputs.map(nameOf))]
    if (choice.device !== null && heard.length === 0)
      return { state: 'away', device: choice.device, devices: names }
    return names.length > 0 ? { state: 'connected', devices: names } : { state: 'no-device' }
  }

  // Off: nothing listened to; connect() hooks the keyboards again.
  let off = false

  // Granted once and kept: a second access would hear every key through ports of its own.
  let granted: MIDIAccess | null = null
  const connectedOutputs = (): MIDIOutput[] =>
    granted && !off
      ? [...granted.outputs.values()].filter((output) => output.state === 'connected')
      : []

  const input: MidiPort = {
    async reconnect() {
      // A browser that cannot say (no Permissions API, no `midi` name) waits for the learner's Connect.
      const state = await permission().catch(() => null)
      return state === 'granted' ? input.connect() : null
    },
    async connect() {
      let status: MidiStatus
      try {
        const access = (granted ??= await requestAccess())
        off = false
        access.onstatechange = () => {
          if (!off) report(hook(access))
        }
        status = hook(access)
      } catch {
        status = { state: 'denied' }
      }
      report(status)
      return status
    },
    disconnect() {
      off = true
      for (const id of [...held.keys()]) letGo(id)
      if (granted) for (const each of granted.inputs.values()) each.onmidimessage = null
      devices = []
      report({ state: 'off' })
    },
    devices: () => devices,
    log: log.entries,
    onLog: log.subscribe,
    clearLog: log.clear,
    configure(next) {
      if (
        next.device === choice.device &&
        next.octaveShift === choice.octaveShift &&
        next.reversedPedal === choice.reversedPedal
      )
        return
      for (const id of [...held.keys()]) letGo(id)
      choice = next
      if (granted && !off) report(hook(granted))
    },
    current: () => current,
    outputs: () => [...new Set(connectedOutputs().map(nameOf))],
    noteOutput() {
      const outputs = connectedOutputs()
      // The chosen keyboard's speaker by its name; where its speaker goes by another name (Windows
      // names a keyboard's ports apart), the one speaker there is, but only while the keyboard
      // chosen is plugged in: away, that speaker is another keyboard's.
      const chosenHere =
        granted !== null &&
        [...granted.inputs.values()].some(
          (each) => each.state === 'connected' && nameOf(each) === choice.device,
        )
      const output =
        outputs.find((each) => choice.device === null || nameOf(each) === choice.device) ??
        (chosenHere && outputs.length === 1 ? outputs[0] : undefined)
      return output ? speakerOf(output) : null
    },
    onNote: notes.add,
    onPedal: pedals.add,
    pedalsDown: () => new Set([...held.values()].flatMap((holding) => [...holding.pedals])),
    onStatus: statuses.add,
  }
  return input
}
