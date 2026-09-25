import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { createFakeMidi } from './fake-midi'
import type { MidiStatus, NoteEvent } from './types'

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

  it('reports a new status', async () => {
    const fake = createFakeMidi()
    const statuses: MidiStatus[] = []
    fake.onStatus((status) => statuses.push(status))
    fake.setStatus({ state: 'no-device' })
    expect(statuses).toEqual([{ state: 'no-device' }])
    expect(await fake.connect()).toEqual({ state: 'no-device' })
  })
})
