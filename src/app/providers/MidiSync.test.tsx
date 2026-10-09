import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { ServicesProvider } from '@/shared/lib/services'
import { MidiSync } from './MidiSync'

describe('MidiSync', () => {
  it('tells the MIDI port the saved settings, rendering nothing', () => {
    const midi = createFakeMidi()
    const settingsStore = createSettingsStore({
      storage: createMemoryStorage(),
      languages: ['en'],
      finePointer: false,
    })
    const { container } = render(
      <SettingsStoreProvider store={settingsStore}>
        <ServicesProvider services={{ audio: createFakeAudio(), midi }}>
          <MidiSync />
        </ServicesProvider>
      </SettingsStoreProvider>,
    )
    expect(container).toBeEmptyDOMElement()
    expect(midi.choices).toEqual([{ device: null, octaveShift: 0, reversedPedal: false }])
  })

  it('does nothing without Web MIDI', () => {
    const settingsStore = createSettingsStore({
      storage: createMemoryStorage(),
      languages: ['en'],
      finePointer: false,
    })
    expect(() =>
      render(
        <SettingsStoreProvider store={settingsStore}>
          <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
            <MidiSync />
          </ServicesProvider>
        </SettingsStoreProvider>,
      ),
    ).not.toThrow()
  })
})
