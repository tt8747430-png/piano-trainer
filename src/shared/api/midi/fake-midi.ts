import type { NoteOutput } from '@/shared/api/audio'
import type { Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import { createListeners } from './listeners'
import { createMidiLog } from './log'
import type { MidiChoice, MidiDevice, MidiPort, MidiStatus, NoteEvent, PedalEvent } from './types'

/** Each pedal's controller, as a keyboard sends it. */
const PEDAL_CONTROLLER = { sustain: 64, sostenuto: 66, soft: 67 } as const satisfies Record<
  PedalKind,
  number
>

/** When a fake message came, on the page's clock: now unless the test says. */
interface At {
  readonly time?: number
}

/**
 * A MidiPort for tests: the test presses the keys and the pedals (the sustain unless it names
 * another), and changes the status; the choices it is told are kept, never applied. What it is
 * played goes to its MIDI log as the first keyboard connected sent it, on channel 1.
 */
export interface FakeMidi extends MidiPort {
  press(midi: Midi, at?: At & { readonly velocity?: number }): void
  release(midi: Midi, at?: At): void
  pedal(down: boolean, at?: At & { readonly pedal?: PedalKind }): void
  setStatus(status: MidiStatus): void
  readonly choices: readonly MidiChoice[]
  /** What its speaker was sent, where the test gave it one. */
  readonly sent: readonly SentNote[]
}

/** A note message the fake's speaker was sent. */
export type SentNote =
  | { readonly kind: 'on'; readonly midi: Midi; readonly velocity: number; readonly at: number }
  | { readonly kind: 'off'; readonly midi: Midi; readonly at: number }
  | { readonly kind: 'clear' }

/** The devices a status names, each one sending keys, with a speaker where the fake has one. */
const devicesIn = (status: MidiStatus | null, output: boolean): readonly MidiDevice[] =>
  status && 'devices' in status
    ? status.devices.map((name) => ({ name, manufacturer: '', input: true, output }))
    : []

/**
 * `allowed`: the learner allowed the keyboard before, so the app reconnects to it as it opens.
 * `output`: the keyboard has a speaker, there while it is connected.
 */
export function createFakeMidi(
  status: MidiStatus = { state: 'connected', devices: ['Keyboard'] },
  { allowed = false, output = false }: { allowed?: boolean; output?: boolean } = {},
): FakeMidi {
  let current: MidiStatus | null = null
  let devices: readonly MidiDevice[] = []
  const log = createMidiLog()
  const logged = (data: number[], time: number) =>
    log.add(devices.find((device) => device.input)?.name ?? '', data, time)
  const notes = createListeners<NoteEvent>()
  const pedals = createListeners<PedalEvent>()
  const down = new Set<PedalKind>()
  const statuses = createListeners<MidiStatus>()
  const choices: MidiChoice[] = []
  const sent: SentNote[] = []
  const speaker: NoteOutput = {
    noteOn: (key, velocity, at) => void sent.push({ kind: 'on', midi: key, velocity, at }),
    noteOff: (key, at) => void sent.push({ kind: 'off', midi: key, at }),
    clear: () => void sent.push({ kind: 'clear' }),
  }
  const connected = () => current?.state === 'connected'
  const report = (next: MidiStatus) => {
    current = next
    devices = devicesIn(next, output)
    statuses.emit(next)
  }
  const connect = async () => {
    const next = current === null || current.state === 'off' ? status : current
    report(next)
    return next
  }
  return {
    connect,
    reconnect: async () => (allowed ? connect() : null),
    current: () => current,
    onNote: notes.add,
    onPedal: pedals.add,
    onStatus: statuses.add,
    disconnect: () => report({ state: 'off' }),
    devices: () => devices,
    log: log.entries,
    onLog: log.subscribe,
    clearLog: log.clear,
    press: (midi, { time = performance.now(), velocity = 100 } = {}) => {
      logged([0x90, midi, velocity], time)
      notes.emit({ midi, on: true, velocity, time })
    },
    release: (midi, { time = performance.now() } = {}) => {
      logged([0x80, midi, 0], time)
      notes.emit({ midi, on: false, velocity: 0, time })
    },
    pedal: (isDown, { time = performance.now(), pedal = 'sustain' } = {}) => {
      logged([0xb0, PEDAL_CONTROLLER[pedal], isDown ? 127 : 0], time)
      if (isDown) down.add(pedal)
      else down.delete(pedal)
      pedals.emit({ pedal, down: isDown, time })
    },
    pedalsDown: () => new Set(down),
    setStatus: report,
    configure(choice) {
      choices.push(choice)
    },
    get choices() {
      return choices
    },
    outputs: () => (output ? ['Keyboard'] : []),
    noteOutput: () => (output && connected() ? speaker : null),
    get sent() {
      return sent
    },
  }
}
