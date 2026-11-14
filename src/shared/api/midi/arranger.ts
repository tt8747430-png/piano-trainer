import { createListeners } from './listeners'

/**
 * What an arranger says: its style started, went on from where it stopped, stopped, or ticked its
 * clock; or its section changed (Yamaha's Section Control, `ss` the section's number).
 */
export type ArrangerEvent =
  | {
      readonly kind: 'start' | 'continue' | 'stop' | 'clock'
      /** When it came, in milliseconds on the page's clock. */
      readonly time: number
    }
  | { readonly kind: 'section'; readonly section: number; readonly time: number }

/**
 * The arranger followed: connected by its name, none plugged in, MIDI or its SysEx refused, or a
 * browser without Web MIDI (Safari, every iPhone browser).
 */
export type ArrangerStatus =
  | { readonly state: 'connected'; readonly device: string }
  | { readonly state: 'no-device' }
  | { readonly state: 'denied' }
  | { readonly state: 'unsupported' }

/**
 * A MIDI arranger (a Yamaha Genos) followed by its clock: its Start, Continue, Stop and clock (24 a
 * beat) heard from its USB TO HOST, and Yamaha's style messages sent to it (Section Control, Start,
 * Stop). Never a note or a chord. Built once in app/composition-root.ts.
 */
export interface ArrangerPort {
  /** Asks for MIDI with SysEx (the browser's prompt) and listens to the arranger. */
  connect(): Promise<ArrangerStatus>
  disconnect(): void
  current(): ArrangerStatus | null
  onStatus(listener: (status: ArrangerStatus) => void): () => void
  onTransport(listener: (event: ArrangerEvent) => void): () => void
  /** A message to the arranger, as bytes; nothing where none is connected. */
  send(bytes: readonly number[]): void
}

/** MIDI's real-time bytes an arranger's transport sends. */
const REALTIME: Readonly<Record<number, 'start' | 'continue' | 'stop' | 'clock'>> = {
  0xf8: 'clock',
  0xfa: 'start',
  0xfb: 'continue',
  0xfc: 'stop',
}
/** The names an arranger's ports carry, Yamaha's first: the one followed where several are plugged in. */
const ARRANGER = /genos|tyros|psr|yamaha|digital workstation/i

/** The arranger among the ports: one sending and taking MIDI, by its name, a Yamaha's first. */
function arrangerOf(access: MIDIAccess): { input: MIDIInput; output: MIDIOutput | null } | null {
  const inputs = [...access.inputs.values()].filter((port) => port.state === 'connected')
  const outputs = [...access.outputs.values()].filter((port) => port.state === 'connected')
  const named = (port: MIDIPort) => port.name ?? port.id
  const input = inputs.find((port) => ARRANGER.test(named(port))) ?? inputs[0]
  if (!input) return null
  const output =
    outputs.find((port) => named(port) === named(input)) ??
    outputs.find((port) => ARRANGER.test(named(port))) ??
    null
  return { input, output }
}

/**
 * The Web MIDI arranger link: an access of its own with SysEx (Section Control needs it), which
 * listens beside the keyboard's (`createWebMidi`) through `addEventListener`, taking only the
 * transport's real-time bytes, so the keys are still heard once.
 */
export function createWebArranger(
  requestAccess: () => Promise<MIDIAccess> = () => navigator.requestMIDIAccess({ sysex: true }),
): ArrangerPort {
  const statuses = createListeners<ArrangerStatus>()
  const transport = createListeners<ArrangerEvent>()
  let current: ArrangerStatus | null = null
  let access: MIDIAccess | null = null
  let linked: { input: MIDIInput; output: MIDIOutput | null } | null = null
  const report = (status: ArrangerStatus) => {
    current = status
    statuses.emit(status)
  }
  const hear = (event: Event) => {
    const data = (event as MIDIMessageEvent).data
    if (!data) return
    const kind = data.length === 1 ? REALTIME[data[0] ?? 0] : undefined
    if (kind) transport.emit({ kind, time: event.timeStamp })
    // Section Control, F0 43 7E 00 ss 7F F7: the arranger's section changed on its panel.
    const [f0, maker, device, model, ss, on, end] = data
    if (
      data.length === 7 &&
      f0 === 0xf0 &&
      maker === 0x43 &&
      device === 0x7e &&
      model === 0x00 &&
      on === 0x7f &&
      end === 0xf7 &&
      ss !== undefined
    )
      transport.emit({ kind: 'section', section: ss, time: event.timeStamp })
  }
  const link = () => {
    linked?.input.removeEventListener('midimessage', hear)
    linked = access ? arrangerOf(access) : null
    linked?.input.addEventListener('midimessage', hear)
    return linked
      ? ({ state: 'connected', device: linked.input.name ?? linked.input.id } as const)
      : ({ state: 'no-device' } as const)
  }
  return {
    async connect() {
      if (typeof navigator?.requestMIDIAccess !== 'function') {
        report({ state: 'unsupported' })
        return { state: 'unsupported' }
      }
      try {
        access ??= await requestAccess()
        access.onstatechange = () => report(link())
        const status = link()
        report(status)
        return status
      } catch {
        report({ state: 'denied' })
        return { state: 'denied' }
      }
    },
    disconnect() {
      linked?.input.removeEventListener('midimessage', hear)
      linked = null
      if (access) access.onstatechange = null
      current = null
    },
    current: () => current,
    onStatus: statuses.add,
    onTransport: transport.add,
    send(bytes) {
      linked?.output?.send([...bytes])
    },
  }
}

/** The arranger as a test drives it: its transport played by hand, what was sent to it kept. */
export interface FakeArranger extends ArrangerPort {
  /** Plays its transport: Start, Continue, Stop, a tick of its clock. */
  play(kind: 'start' | 'continue' | 'stop' | 'clock', time?: number): void
  /** Its panel switched to section `ss`. */
  section(ss: number, time?: number): void
  readonly sent: readonly (readonly number[])[]
}

export function createFakeArranger(
  status: ArrangerStatus = { state: 'connected', device: 'Digital Workstation' },
): FakeArranger {
  const statuses = createListeners<ArrangerStatus>()
  const transport = createListeners<ArrangerEvent>()
  let current: ArrangerStatus | null = null
  const sent: (readonly number[])[] = []
  return {
    async connect() {
      current = status
      statuses.emit(status)
      return status
    },
    disconnect() {
      current = null
    },
    current: () => current,
    onStatus: statuses.add,
    onTransport: transport.add,
    send(bytes) {
      if (current?.state === 'connected') sent.push([...bytes])
    },
    play(kind, time = performance.now()) {
      transport.emit({ kind, time })
    },
    section(section, time = performance.now()) {
      transport.emit({ kind: 'section', section, time })
    },
    sent,
  }
}
