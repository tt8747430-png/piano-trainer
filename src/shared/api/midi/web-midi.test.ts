import { describe, expect, it, vi } from 'vitest'
import type { MidiStatus, NoteEvent, PedalEvent } from './types'
import { createWebMidiInput, hasWebMidi } from './web-midi'

class FakeInput {
  onmidimessage: ((event: { data: Uint8Array; timeStamp: number }) => void) | null = null
  state: 'connected' | 'disconnected' = 'connected'
  constructor(
    readonly id: string,
    readonly name: string | null,
  ) {}
  /** A message as the browser hands it on: its bytes, and when it came on the page's clock. */
  send(data: number[], timeStamp = 0) {
    this.onmidimessage?.({ data: Uint8Array.from(data), timeStamp })
  }
}

class FakeAccess {
  readonly inputs = new Map<string, FakeInput>()
  onstatechange: (() => void) | null = null
  constructor(...inputs: FakeInput[]) {
    for (const input of inputs) this.inputs.set(input.id, input)
  }
  plugIn(input: FakeInput) {
    this.inputs.set(input.id, input)
    this.onstatechange?.()
  }
  unplug(input: FakeInput) {
    this.inputs.delete(input.id)
    this.onstatechange?.()
  }
  /** Unplugged, as Chrome may report it: still in the map, its state disconnected. */
  disconnect(input: FakeInput) {
    input.state = 'disconnected'
    this.onstatechange?.()
  }
}

const withAccess = (access: FakeAccess) =>
  createWebMidiInput(async () => access as unknown as MIDIAccess)

describe('createWebMidiInput', () => {
  it('connects to every keyboard plugged in', async () => {
    const midi = withAccess(new FakeAccess(new FakeInput('a', 'Piano'), new FakeInput('b', 'Pads')))
    expect(await midi.connect()).toEqual({ state: 'connected', devices: ['Piano', 'Pads'] })
  })

  it('reports no device when none is plugged in', async () => {
    expect(await withAccess(new FakeAccess()).connect()).toEqual({ state: 'no-device' })
  })

  it('reconnects on its own only where the keyboard was allowed before', async () => {
    const request = vi.fn(
      async () => new FakeAccess(new FakeInput('a', 'Piano')) as unknown as MIDIAccess,
    )
    const allowed = createWebMidiInput(request, async () => 'granted')
    expect(await allowed.reconnect()).toEqual({ state: 'connected', devices: ['Piano'] })
    expect(allowed.current()).toEqual({ state: 'connected', devices: ['Piano'] })
    const asked = vi.fn(async () => new FakeAccess() as unknown as MIDIAccess)
    const notYet = createWebMidiInput(asked, async () => 'prompt')
    expect(await notYet.reconnect()).toBeNull()
    expect(asked).not.toHaveBeenCalled()
    expect(notYet.current()).toBeNull()
    const unknown = createWebMidiInput(asked, () => Promise.reject(new TypeError('midi')))
    expect(await unknown.reconnect()).toBeNull()
    expect(asked).not.toHaveBeenCalled()
  })

  it('reports a refused permission', async () => {
    const midi = createWebMidiInput(() => Promise.reject(new DOMException('no', 'SecurityError')))
    expect(await midi.connect()).toEqual({ state: 'denied' })
  })

  it('hands on the keys played on any keyboard, until unsubscribed', async () => {
    const piano = new FakeInput('a', 'Piano')
    const pads = new FakeInput('b', 'Pads')
    const midi = withAccess(new FakeAccess(piano, pads))
    const heard: NoteEvent[] = []
    const unsubscribe = midi.onNote((event) => heard.push(event))
    await midi.connect()
    piano.send([0x90, 60, 90], 120.5)
    pads.send([0x80, 62, 0], 130)
    pads.send([0xb0, 64, 127], 140)
    unsubscribe()
    piano.send([0x90, 64, 90], 150)
    expect(heard).toEqual([
      { midi: 60, on: true, velocity: 90, time: 120.5 },
      { midi: 62, on: false, velocity: 0, time: 130 },
    ])
  })

  it('hands on the sustain pedal, apart from the keys', async () => {
    const piano = new FakeInput('a', 'Piano')
    const midi = withAccess(new FakeAccess(piano))
    const pedal: PedalEvent[] = []
    const keys = vi.fn()
    midi.onPedal((event) => pedal.push(event))
    midi.onNote(keys)
    await midi.connect()
    piano.send([0xb0, 64, 127], 10)
    piano.send([0xb0, 64, 0], 20)
    piano.send([0xb0, 7, 100], 30)
    expect(pedal).toEqual([
      { down: true, time: 10 },
      { down: false, time: 20 },
    ])
    expect(keys).not.toHaveBeenCalled()
  })

  it('hooks a keyboard plugged in later and reports the new status', async () => {
    const access = new FakeAccess()
    const midi = withAccess(access)
    const statuses: MidiStatus[] = []
    const heard = vi.fn()
    midi.onStatus((status) => statuses.push(status))
    midi.onNote(heard)
    await midi.connect()
    const piano = new FakeInput('a', null)
    access.plugIn(piano)
    piano.send([0x90, 60, 90])
    expect(statuses).toEqual([{ state: 'no-device' }, { state: 'connected', devices: ['a'] }])
    expect(heard).toHaveBeenCalledOnce()
  })

  it('lets go of the keys still held on a keyboard unplugged, and only those', async () => {
    const piano = new FakeInput('a', 'Piano')
    const pads = new FakeInput('b', 'Pads')
    const access = new FakeAccess(piano, pads)
    const midi = withAccess(access)
    const heard: NoteEvent[] = []
    midi.onNote((event) => heard.push(event))
    await midi.connect()
    piano.send([0x90, 60, 90])
    piano.send([0x90, 64, 90])
    piano.send([0x80, 64, 0])
    pads.send([0x90, 67, 90])
    heard.length = 0
    access.unplug(piano)
    expect(heard).toEqual([{ midi: 60, on: false, velocity: 0, time: expect.any(Number) }])
  })

  it('lets go of the pedal held down on a keyboard unplugged', async () => {
    const piano = new FakeInput('a', 'Piano')
    const pads = new FakeInput('b', 'Pads')
    const access = new FakeAccess(piano, pads)
    const midi = withAccess(access)
    const pedal: PedalEvent[] = []
    midi.onPedal((event) => pedal.push(event))
    await midi.connect()
    piano.send([0xb0, 64, 127])
    access.unplug(pads)
    access.unplug(piano)
    expect(pedal.map((event) => event.down)).toEqual([true, false])
  })

  it('lets go of a keyboard’s keys when its port turns disconnected in place', async () => {
    const piano = new FakeInput('a', 'Piano')
    const access = new FakeAccess(piano)
    const midi = withAccess(access)
    const heard: NoteEvent[] = []
    const statuses: MidiStatus[] = []
    midi.onNote((event) => heard.push(event))
    midi.onStatus((status) => statuses.push(status))
    await midi.connect()
    piano.send([0x90, 60, 90])
    access.disconnect(piano)
    expect(heard.at(-1)).toEqual({ midi: 60, on: false, velocity: 0, time: expect.any(Number) })
    expect(statuses.at(-1)).toEqual({ state: 'no-device' })
  })

  it('asks for access once, so a retry never hears a key twice', async () => {
    // Each access the browser grants has its own port objects for the same keyboard.
    const ports: FakeInput[] = []
    const midi = createWebMidiInput(async () => {
      const port = new FakeInput('a', 'Piano')
      ports.push(port)
      return new FakeAccess(port) as unknown as MIDIAccess
    })
    const heard = vi.fn()
    midi.onNote(heard)
    await midi.connect()
    await midi.connect()
    for (const port of ports) port.send([0x90, 60, 90])
    expect(heard).toHaveBeenCalledOnce()
  })

  it('has no status before it is connected, then keeps the last one', async () => {
    const access = new FakeAccess()
    const midi = withAccess(access)
    expect(midi.current()).toBeNull()
    await midi.connect()
    expect(midi.current()).toEqual({ state: 'no-device' })
    access.plugIn(new FakeInput('a', 'Piano'))
    expect(midi.current()).toEqual({ state: 'connected', devices: ['Piano'] })
  })

  it('keeps a refused permission as its status', async () => {
    const midi = createWebMidiInput(() => Promise.reject(new DOMException('no', 'SecurityError')))
    await midi.connect()
    expect(midi.current()).toEqual({ state: 'denied' })
  })
})

describe('hasWebMidi', () => {
  it('is true only where the browser can ask for MIDI access', () => {
    expect(hasWebMidi({ requestMIDIAccess: () => Promise.reject() } as unknown as Navigator)).toBe(
      true,
    )
    expect(hasWebMidi({} as Navigator)).toBe(false)
  })
})
