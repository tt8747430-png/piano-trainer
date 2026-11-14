import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, createFakeArranger } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { FloatingHost } from '@/shared/ui'
import { PageKeyboardTools } from './PageKeyboardTools'
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

/** A page's keys with its bar's keyboard controls beside them, as a page's bar holds them (R34). */
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
      <ServicesProvider
        services={{
          audio: createFakeAudio(),
          arranger: createFakeArranger(),
          midi: createFakeMidi(),
        }}
      >
        <FloatingHost screen="page">
          <PageKeyboardTools screen={kind} />
          <PinnedKeyboard shown={{ keys: [midi(60)], marks: new Map() }} screen={kind} />
        </FloatingHost>
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { settingsStore }
}

const keys = () => screen.queryByRole('group', { name: 'Keyboard' })
const toggle = () => screen.getByRole('button', { name: 'Keyboard' })

describe('PinnedKeyboard', () => {
  it('opens a reading page with its keys out on a phone held upright, Keyboard pressed', () => {
    renderPinned({ onSide: false })
    expect(keys()).toBeInTheDocument()
    expect(toggle()).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens a reading page with its keys hidden on a phone on its side', () => {
    renderPinned({ onSide: true })
    expect(keys()).not.toBeInTheDocument()
    expect(toggle()).toHaveAttribute('aria-pressed', 'false')
  })

  it('folds hidden keys into a strip where they stood, nothing floating: a tap brings them back (R34)', async () => {
    const user = userEvent.setup()
    renderPinned({ onSide: false })
    await user.click(toggle())
    expect(keys()).not.toBeInTheDocument()
    const strip = screen.getByRole('button', { name: 'Show the keyboard' })
    expect(strip).toHaveTextContent('Keyboard')
    expect(strip.closest('[data-slot="docked"]')).not.toBeNull()
    expect(screen.getAllByRole('button')).toEqual([toggle(), strip])
    await user.click(strip)
    expect(keys()).toBeInTheDocument()
    expect(toggle()).toHaveAttribute('aria-pressed', 'true')
  })

  it('remembers the keys shown on a phone on its side, apart from the upright choice', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderPinned({ onSide: true })
    await user.click(toggle())
    expect(keys()).toBeInTheDocument()
    expect(settingsStore.getState().keyboard).toMatchObject({
      foldedLandscape: false,
      folded: false,
    })
    await user.click(toggle())
    expect(settingsStore.getState().keyboard).toMatchObject({
      foldedLandscape: true,
      folded: false,
    })
  })

  it('keeps the keys out on a screen played on, a phone on its side or not', () => {
    renderPinned({ onSide: true, screen: 'playing' })
    expect(keys()).toBeInTheDocument()
  })

  it('stands edge to edge, with nothing under its keys', () => {
    renderPinned({ onSide: false })
    const docked = document.querySelector('[data-slot="docked"]')
    expect(docked).not.toHaveClass('px-gutter')
    expect(docked?.querySelectorAll('button:not([data-midi])')).toHaveLength(0)
    // Its divider over the keys, facing the music.
    expect(docked?.firstElementChild?.firstElementChild).toHaveAttribute('role', 'separator')
  })
})
