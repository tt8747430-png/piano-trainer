import { render } from '@testing-library/react'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { untilTestEnds } from '@/shared/test/listeners'
import type { KeyMark } from '@/shared/ui'
import { KeyboardTools } from '../ui/KeyboardTools'
import { LiveKeyboard } from '../ui/LiveKeyboard'

const ONE_OCTAVE = { from: midi(60), to: midi(71) }

/**
 * A live keyboard over C4–B4 (what a key plays as asked) under its bar's controls (`KeyboardTools`,
 * the music's pedal down where `sustained`), with fake audio and MIDI, a fresh settings store, and a
 * text field beside it.
 */
export function renderLiveKeyboard({
  onKeyPress,
  keyPlays,
  spotlight = false,
  marks,
  sustained = false,
  divider,
  onShow = () => undefined,
  hands,
}: {
  onKeyPress?: (key: Midi) => void
  keyPlays?: (key: Midi) => readonly Midi[]
  spotlight?: boolean
  marks?: ReadonlyMap<Midi, KeyMark>
  sustained?: boolean
  divider?: 'above' | 'below'
  onShow?: (shown: boolean) => void
  /** The Player's Hands beside Keyboard (R36). */
  hands?: { shown: boolean; onShow: (shown: boolean) => void }
} = {}) {
  const audio = createFakeAudio()
  const midiKeyboard = createFakeMidi()
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    signal: untilTestEnds(),
    languages: ['en'],
    finePointer: false,
  })
  const { unmount } = render(
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio, midi: midiKeyboard }}>
        <KeyboardTools shown onShow={onShow} sustained={sustained} hands={hands} />
        <LiveKeyboard
          range={ONE_OCTAVE}
          spotlight={spotlight}
          marks={marks}
          keyPlays={keyPlays}
          divider={divider}
          {...(onKeyPress ? { onKeyPress } : {})}
        />
        <input aria-label="Search" />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { audio, midiKeyboard, settingsStore, unmount }
}
