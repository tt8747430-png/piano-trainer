import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { createFakeMidi } from './fake-midi'
import type { MidiStatus, NoteEvent, PedalEvent } from './types'

describe('createFakeMidi', () => {
  it('connects with the status it was given', async () => {
    expect(await createFakeMidi().connect()).toEqual({ state: 'connected', devices: ['Keyboard'] })
    expect(await createFakeMidi({ state: 'denied' }).connect()).toEqual({ state: 'denied' })
  })

  it('plays keys to its listeners until they unsubscribe', () => {
    const fake = createFakeMidi()
    const heard: NoteEvent[] = []
    const unsubscribe = fake.onNote((event) => heard.push(event))
    fake.press(midi(60))
    fake.release(midi(60))
    unsubscribe()
    fake.press(midi(62))
    expect(heard.map(({ midi: key, on }) => [key, on])).toEqual([
      [60, true],
      [60, false],
    ])
  })

  it('plays keys and the pedal at the times the test gives', () => {
    const fake = createFakeMidi()
    const heard: NoteEvent[] = []
    const pedal: PedalEvent[] = []
    fake.onNote((event) => heard.push(event))
    fake.onPedal((event) => pedal.push(event))
    fake.press(midi(60), { time: 100, velocity: 40 })
    fake.pedal(true, { time: 150 })
    fake.release(midi(60), { time: 200 })
    fake.pedal(false, { time: 250 })
    expect(heard).toEqual([
      { midi: 60, on: true, velocity: 40, time: 100 },
      { midi: 60, on: false, velocity: 0, time: 200 },
    ])
    expect(pedal).toEqual([
      { down: true, time: 150 },
      { down: false, time: 250 },
    ])
  })

  it('reports a new status', async () => {
    const fake = createFakeMidi()
    const statuses: MidiStatus[] = []
    fake.onStatus((status) => statuses.push(status))
    fake.setStatus({ state: 'no-device' })
    expect(statuses).toEqual([{ state: 'no-device' }])
    expect(await fake.connect()).toEqual({ state: 'no-device' })
  })

  it('has no status before it is connected, then keeps the last one', async () => {
    const keyboard = createFakeMidi()
    expect(keyboard.current()).toBeNull()
    await keyboard.connect()
    expect(keyboard.current()).toEqual({ state: 'connected', devices: ['Keyboard'] })
    keyboard.setStatus({ state: 'no-device' })
    expect(keyboard.current()).toEqual({ state: 'no-device' })
  })
})
