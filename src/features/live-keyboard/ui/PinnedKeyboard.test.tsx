import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { FloatingHost } from '@/shared/ui'
import { PinnedKeyboard } from './PinnedKeyboard'

/** A screen as tall or as short as asked: a phone on its side matches the `landscape-phone` query alone. */
function stubScreen(onSide: boolean) {
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: onSide && media.includes('max-height: 500px'),
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

function renderPinned({
  onSide,
  screen: kind,
}: {
  onSide: boolean
  screen?: 'reading' | 'playing'
}) {
  stubScreen(onSide)
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  render(
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
        <FloatingHost place="right" labels={false} screen="page">
          <PinnedKeyboard shown={{ keys: [midi(60)], marks: new Map() }} screen={kind} />
        </FloatingHost>
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { settingsStore }
}

const keysButton = () => screen.queryByRole('button', { name: 'Keys' })
const foldButton = () => screen.queryByRole('button', { name: 'Hide the keys' })

describe('PinnedKeyboard', () => {
  it('opens a reading page with its keys out on a phone held upright', () => {
    renderPinned({ onSide: false })
    expect(foldButton()).toBeInTheDocument()
    expect(keysButton()).not.toBeInTheDocument()
  })

  it('opens a reading page with its keys folded on a phone on its side', () => {
    renderPinned({ onSide: true })
    expect(keysButton()).toBeInTheDocument()
    expect(foldButton()).not.toBeInTheDocument()
  })

  it('remembers the keys unfolded on a phone on its side, apart from the upright fold', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderPinned({ onSide: true })
    await user.click(screen.getByRole('button', { name: 'Keys' }))
    expect(foldButton()).toBeInTheDocument()
    expect(settingsStore.getState().keyboard).toMatchObject({
      foldedLandscape: false,
      folded: false,
    })
  })

  it('folds on a phone on its side without folding the keys held upright', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderPinned({ onSide: true })
    await user.click(screen.getByRole('button', { name: 'Keys' }))
    await user.click(screen.getByRole('button', { name: 'Hide the keys' }))
    expect(keysButton()).toBeInTheDocument()
    expect(settingsStore.getState().keyboard).toMatchObject({
      foldedLandscape: true,
      folded: false,
    })
  })

  it('keeps Hide the keys in sight, out of the rail controls that scroll on a short rail', () => {
    renderPinned({ onSide: false })
    expect(foldButton()?.closest('[data-slot=rail-controls]')).toBeNull()
    expect(
      screen.getByRole('button', { name: 'Pedal' }).closest('[data-slot=rail-controls]'),
    ).not.toBeNull()
  })

  it('keeps the keys out on a screen played on, a phone on its side or not', () => {
    renderPinned({ onSide: true, screen: 'playing' })
    expect(foldButton()).toBeInTheDocument()
    expect(keysButton()).not.toBeInTheDocument()
  })
})
