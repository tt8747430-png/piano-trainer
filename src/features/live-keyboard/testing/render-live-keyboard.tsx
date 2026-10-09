import { render } from '@testing-library/react'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { KeyMark } from '@/shared/ui'
import { LiveKeyboard } from '../ui/LiveKeyboard'

export const ONE_OCTAVE = { from: midi(60), to: midi(71) }

/** A live keyboard over C4–B4 (what a key plays as asked) with fake audio and MIDI, a fresh settings store, and a text field beside it. */
export function renderLiveKeyboard({
  onKeyPress,
  keyPlays,
  spotlight = false,
  marks,
}: {
  onKeyPress?: (key: Midi) => void
  keyPlays?: (key: Midi) => readonly Midi[]
  spotlight?: boolean
  marks?: ReadonlyMap<Midi, KeyMark>
} = {}) {
  const audio = createFakeAudio()
  const midiKeyboard = createFakeMidi()
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  const { unmount } = render(
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio, midi: midiKeyboard }}>
        <LiveKeyboard
          range={ONE_OCTAVE}
          spotlight={spotlight}
          marks={marks}
          keyPlays={keyPlays}
          {...(onKeyPress ? { onKeyPress } : {})}
        />
        <input aria-label="Search" />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { audio, midiKeyboard, settingsStore, unmount }
}
