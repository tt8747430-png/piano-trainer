import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { ServicesProvider } from '@/shared/lib/services'
import { untilTestEnds } from '@/shared/test/listeners'
import { MidiReconnect } from './MidiReconnect'

const renderWith = (midi: FakeMidi | null, { input = true }: { input?: boolean } = {}) => {
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    signal: untilTestEnds(),
    languages: ['en'],
    finePointer: false,
  })
  setMidi(settingsStore, { input })
  return render(
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi }}>
        <MidiReconnect />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
}

describe('MidiReconnect', () => {
  it('connects to a keyboard the learner allowed before, as the app opens', async () => {
    const midi = createFakeMidi(undefined, { allowed: true })
    renderWith(midi)
    await waitFor(() =>
      expect(midi.current()).toEqual({ state: 'connected', devices: ['Keyboard'] }),
    )
  })

  it('asks nothing where the learner has not allowed one yet', async () => {
    const midi = createFakeMidi(undefined, { allowed: false })
    renderWith(midi)
    await Promise.resolve()
    expect(midi.current()).toBeNull()
  })

  it('connects nothing where the learner turned MIDI input off', async () => {
    const midi = createFakeMidi(undefined, { allowed: true })
    renderWith(midi, { input: false })
    await Promise.resolve()
    expect(midi.current()).toBeNull()
  })

  it('renders nothing without Web MIDI', () => {
    const { container } = renderWith(null)
    expect(container).toBeEmptyDOMElement()
  })
})
