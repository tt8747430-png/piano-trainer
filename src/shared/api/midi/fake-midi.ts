import type { Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import { createListeners } from './listeners'
import type { MidiChoice, MidiInput, MidiStatus, NoteEvent, PedalEvent } from './types'

/** When a fake message came, on the page's clock: now unless the test says. */
interface At {
  readonly time?: number
}

/**
 * A MidiInput for tests: the test presses the keys and the pedals (the sustain unless it names
 * another), and changes the status; the choices it is told are kept, never applied.
 */
export interface FakeMidi extends MidiInput {
  press(midi: Midi, at?: At & { readonly velocity?: number }): void
  release(midi: Midi, at?: At): void
  pedal(down: boolean, at?: At & { readonly pedal?: PedalKind }): void
  setStatus(status: MidiStatus): void
  readonly choices: readonly MidiChoice[]
}

/** `allowed`: the learner allowed the keyboard before, so the app reconnects to it as it opens. */
export function createFakeMidi(
  status: MidiStatus = { state: 'connected', devices: ['Keyboard'] },
  { allowed = false }: { allowed?: boolean } = {},
): FakeMidi {
  let current: MidiStatus | null = null
  const notes = createListeners<NoteEvent>()
  const pedals = createListeners<PedalEvent>()
  const statuses = createListeners<MidiStatus>()
  const choices: MidiChoice[] = []
  const report = (next: MidiStatus) => {
    current = next
    statuses.emit(next)
  }
  const connect = async () => {
    const next = current ?? status
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
    press: (midi, { time = performance.now(), velocity = 100 } = {}) =>
      notes.emit({ midi, on: true, velocity, time }),
    release: (midi, { time = performance.now() } = {}) =>
      notes.emit({ midi, on: false, velocity: 0, time }),
    pedal: (down, { time = performance.now(), pedal = 'sustain' } = {}) =>
      pedals.emit({ pedal, down, time }),
    setStatus: report,
    configure(choice) {
      choices.push(choice)
    },
    get choices() {
      return choices
    },
  }
}
