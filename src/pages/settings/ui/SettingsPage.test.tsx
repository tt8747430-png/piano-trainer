import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { LAPTOP } from '@/shared/lib'
import { stubServiceWorker } from '@/shared/test/pwa-register'
import { expectLastAndAlone } from '@/shared/test/danger'

/** A laptop's screen, as `matchMedia` answers it. */
const onLaptop = () =>
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: media === LAPTOP,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))

describe('Settings', () => {
  it('goes back to the Profile it was opened from', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/profile')
    await user.click(
      within(await screen.findByRole('main')).getAllByRole('link', { name: 'Settings' })[0]!,
    )
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/profile'))
  })

  it('goes back to the Profile when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/profile'))
  })

  it('is one grouped list: the account card, General, Playing, Practice, Help', async () => {
    await renderApp('/settings')
    const card = within(await screen.findByRole('navigation', { name: 'Account' }))
    expect(card.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Sign in Sign in to sync your songs on every device',
    ])
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'General',
      'Playing',
      'Practice',
      'Help',
    ])
    expect(
      screen
        .getAllByRole('link')
        .map((row) => row.getAttribute('href'))
        .filter((href) => href?.startsWith('/settings/') || href?.startsWith('/legal/')),
    ).toEqual([
      '/settings/general',
      '/settings/storage',
      '/settings/on-screen-piano',
      '/settings/connect-piano',
      '/settings/computer-keys',
      '/settings/sound-and-recording',
      '/settings/chords',
      '/settings/scales',
      '/settings/intervals',
      '/settings/progressions',
      '/settings/accompaniment',
      '/settings/chord-finder',
      '/settings/exercises-and-quiz',
      '/settings/how-to-use',
      '/legal/privacy',
      '/legal/terms',
    ])
  })

  it('shows the saved language and theme on General, each changed in place and saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/general')
    const general = await screen.findByRole('main')
    expect(within(general).getByRole('combobox', { name: 'Language' })).toHaveTextContent('English')
    // The theme is three small screens (R21), the system's chosen.
    const theme = within(general).getByRole('radiogroup', { name: 'Theme' })
    expect(within(theme).getByRole('radio', { name: 'System' })).toBeChecked()
    await user.click(within(theme).getByRole('radio', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
    await user.click(within(general).getByRole('combobox', { name: 'Language' }))
    await user.click(await screen.findByRole('option', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('keeps the on-screen piano on its page, each group under its own heading', async () => {
    await renderApp('/settings/on-screen-piano')
    expect(await screen.findByRole('heading', { level: 1, name: 'On-screen piano' })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Look',
      'Position',
      'Playing',
      'Bar over the keys',
    ])
    expect(screen.queryByRole('switch', { name: /^Play from the computer keys/ })).toBeNull()
  })

  it('keeps what the device keeps, the backup and the progress under Storage and backup', async () => {
    await renderApp('/settings/storage')
    await screen.findByRole('region', { name: 'Backup' })
    expect(screen.queryByRole('button', { name: 'Sync now' })).toBeNull()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'On this device',
      'Backup',
    ])
  })

  it('stands in two panes on a laptop: the list beside General, neither with Back (R20)', async () => {
    onLaptop()
    const { router } = await renderApp('/settings')
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/general'))
    expect(await screen.findByRole('heading', { level: 1, name: 'General' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Account' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'General' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('says the app’s version under Help', async () => {
    await renderApp('/settings')
    const help = await screen.findByRole('region', { name: 'Help' })
    expect(help).toHaveTextContent(/Version\s*dev/)
  })

  it('keeps how a take is recorded under Recording: the metronome and the tune, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/sound-and-recording')
    const recording = await screen.findByRole('region', { name: 'Recording' })
    await user.click(within(recording).getByRole('switch', { name: 'Metronome' }))
    await user.click(within(recording).getByRole('switch', { name: 'Play melody' }))
    expect(settingsStore.getState().recorder).toEqual({ click: false, tune: true })
    expect(screen.getByRole('link', { name: 'Metronome' })).toHaveAttribute(
      'href',
      '/practice/metronome',
    )
    await user.click(within(recording).getByRole('button', { name: 'About Metronome' }))
    expect(await screen.findByRole('dialog', { name: 'Metronome' })).toHaveTextContent(
      'The beat goes on after the count-in',
    )
  })

  it('says what a backup holds beside its heading, never in a line under it', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/storage')
    const backup = await screen.findByRole('region', { name: 'Backup' })
    expect(backup).not.toHaveTextContent('live on this device only')
    await user.click(within(backup).getByRole('button', { name: 'About Backup' }))
    expect(await screen.findByRole('dialog', { name: 'Backup' })).toHaveTextContent(
      'live on this device only',
    )
  })

  it('sets up the keyboard, and saves each change', async () => {
    const user = userEvent.setup()
    const { settingsStore, router } = await renderApp('/settings/on-screen-piano')
    const keys = await screen.findByRole('radiogroup', { name: 'Key size' })
    await user.click(within(keys).getByRole('radio', { name: 'Large' }))
    await user.click(screen.getByRole('switch', { name: /^Chord names/ }))
    const swipe = screen.getByRole('radiogroup', { name: 'A swipe on the keys' })
    await user.click(within(swipe).getByRole('radio', { name: 'Plays' }))
    // Fold the keys: the two saved folds as one choice of three (R21).
    const fold = screen.getByRole('radiogroup', { name: 'Fold the keys' })
    expect(within(fold).getByRole('radio', { name: 'On its side' })).toBeChecked()
    await user.click(within(fold).getByRole('radio', { name: 'Always' }))
    expect(settingsStore.getState().keyboard).toMatchObject({ folded: true })
    await user.click(within(fold).getByRole('radio', { name: 'Never' }))
    expect(settingsStore.getState().keyboard).toMatchObject({
      folded: false,
      foldedLandscape: false,
    })
    await act(() => router.navigate({ to: '/settings/computer-keys' }))
    await user.click(await screen.findByRole('switch', { name: /^Play from the computer keys/ }))
    expect(settingsStore.getState().keyboard).toMatchObject({
      keySize: 'large',
      typing: true,
      chordNames: false,
      swipe: 'glissando',
    })
  })

  it('says what a keyboard choice does in a popover beside its name, never in a line under it', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/on-screen-piano')
    await user.click(await screen.findByRole('button', { name: 'About Key size' }))
    expect(await screen.findByRole('dialog', { name: 'Key size' })).toHaveTextContent(
      /fills the width/,
    )
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText(/fills the width/)).toBeNull())
  })

  it('keeps on the bar over the keys only the buttons chosen, in the bar’s order', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/on-screen-piano')
    const bar = await screen.findByRole('group', { name: 'Buttons on the bar' })
    await user.click(within(bar).getByRole('button', { name: /^Glissando/ }))
    expect(within(bar).getByRole('button', { name: /^Glissando/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await user.click(within(bar).getByRole('button', { name: /^Glissando/ }))
    expect(settingsStore.getState().keyboard.railControls).toEqual([
      'zoom',
      'noteNames',
      'chordNames',
      'typing',
      'midiSound',
      'glissando',
      'pedal',
    ])
    await user.click(within(bar).getByRole('button', { name: /^Note names/ }))
    expect(settingsStore.getState().keyboard.railControls).not.toContain('noteNames')
  })

  it('says on Connect a piano’s row when the browser cannot connect one', async () => {
    await renderApp('/settings', { webMidi: false })
    const row = (await screen.findByText('Connect a piano')).closest('a') as HTMLElement
    expect(row).toHaveTextContent(/Connect a piano\s*Not available/)
  })

  it('reads in Russian, with nothing left in English', async () => {
    for (const path of [
      '/settings',
      '/settings/general',
      '/settings/on-screen-piano',
      '/settings/computer-keys',
      '/settings/sound-and-recording',
      '/settings/storage',
    ]) {
      const { unmount } = await renderApp(path, { locale: 'ru' })
      await screen.findByRole('heading', { level: 1 })
      expect(untranslated(document.body)).toEqual([])
      unmount()
    }
  })

  it('resets progress only after confirming, then closes the dialog', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/settings/storage')
    act(() => progressStore.setState({ learned: { 'chords:tri': '2026-09-25T10:00:00Z' } }))
    expectLastAndAlone(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(screen.getByRole('button', { name: 'Keep it' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('says the version is up to date, and that it cannot look offline', async () => {
    const user = userEvent.setup()
    await renderApp('/settings')
    const version = await screen.findByRole('button', { name: /^Version/ })
    expect(version).toHaveTextContent('Up to date')
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    await user.click(version)
    expect(version).toHaveTextContent("Can't check while offline")
  })

  it('installs a waiting version from Settings, and marks the Profile’s way there', async () => {
    const { updateServiceWorker } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    const { router } = await renderApp('/profile')
    expect(
      await screen.findByRole('link', { name: 'Settings, New version ready' }),
    ).toBeInTheDocument()
    await act(() => router.navigate({ to: '/settings' }))
    expect(await screen.findByRole('button', { name: /^Version/ })).toHaveTextContent(
      'New version ready',
    )
    await user.click(screen.getByRole('button', { name: 'Install and restart' }))
    expect(updateServiceWorker).toHaveBeenCalledExactlyOnceWith(true)
  })
})
