import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { touchVelocity } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import { useMidiSync } from './use-midi-sync'

function setUp() {
  const audio = createFakeAudio()
  const keyboard = createFakeMidi()
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio, midi: keyboard }}>{children}</ServicesProvider>
    </SettingsStoreProvider>
  )
  const hook = renderHook(useMidiSync, { wrapper })
  return { audio, keyboard, settingsStore, unmount: hook.unmount }
}

const C = midi(60)

describe('useMidiSync', () => {
  it('tells the port which keyboard to hear, shifted and with its pedal’s way', () => {
    const { keyboard, settingsStore } = setUp()
    expect(keyboard.choices.at(-1)).toEqual({ device: null, octaveShift: 0, reversedPedal: false })
    act(() => setMidi(settingsStore, { device: 'Piano', octaveShift: -1, pedal: 'reversed' }))
    expect(keyboard.choices.at(-1)).toEqual({
      device: 'Piano',
      octaveShift: -1,
      reversedPedal: true,
    })
  })

  it('sounds no MIDI key until Sound the MIDI keyboard is on', () => {
    const { audio, keyboard, settingsStore } = setUp()
    keyboard.press(C, { velocity: 80 })
    keyboard.release(C)
    expect(audio.voice).toEqual([])
    act(() => setMidi(settingsStore, { sound: true, touch: 'light' }))
    keyboard.press(C, { velocity: 80 })
    keyboard.release(C)
    expect(audio.voice).toEqual([
      { kind: 'press', midi: C, velocity: touchVelocity(80, 'light') },
      { kind: 'release', midi: C },
    ])
  })

  it('lets go of a key it sounds as the switch goes off, or the app goes', () => {
    const { audio, keyboard, settingsStore, unmount } = setUp()
    act(() => setMidi(settingsStore, { sound: true }))
    keyboard.press(C)
    act(() => setMidi(settingsStore, { sound: false }))
    expect(audio.voice.at(-1)).toEqual({ kind: 'release', midi: C })
    act(() => setMidi(settingsStore, { sound: true }))
    keyboard.press(C)
    unmount()
    expect(audio.voice.at(-1)).toEqual({ kind: 'release', midi: C })
  })

  it('hands every pedal to the voice, the switch off too', () => {
    const { audio, keyboard } = setUp()
    keyboard.pedal(true)
    keyboard.pedal(true, { pedal: 'sostenuto' })
    expect(audio.pedals()).toEqual({ sustain: true, soft: false, sostenuto: true })
  })
})
