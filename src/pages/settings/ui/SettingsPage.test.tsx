import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createFakeErrorReporter } from '@/shared/api/errors'
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

  it('holds only the app’s own pages: the account card, App, Piano, Library, Support', async () => {
    await renderApp('/settings')
    const card = within(await screen.findByRole('navigation', { name: 'Account' }))
    expect(card.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Sign inSync your library across your devices',
    ])
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'App',
      'Piano',
      'Library',
      'Support',
    ])
    expect(
      screen
        .getAllByRole('link')
        .map((row) => row.getAttribute('href'))
        .filter((href) => href?.startsWith('/settings/') || href?.startsWith('/legal/')),
    ).toEqual([
      '/settings/general',
      '/settings/appearance',
      '/settings/storage',
      '/settings/connect-piano',
      '/settings/select-toolbar',
      '/settings/swipe-actions',
      '/settings/how-to-use',
      '/settings/feedback',
      '/settings/about',
    ])
    // View as a learner and the legal pages are elsewhere (R32): the Account, About.
    expect(screen.queryByRole('switch')).toBeNull()
  })

  it('has no Player, Score editor, Sound and recording, Computer keys or Practice rows', async () => {
    await renderApp('/settings')
    await screen.findByRole('navigation', { name: 'Account' })
    for (const name of [
      'Player',
      'Score editor',
      'Sound and recording',
      'Computer keys',
      'Chords',
    ]) {
      expect(screen.queryByRole('link', { name: new RegExp(`^${name}`) })).toBeNull()
    }
  })

  it('shows the saved language on General and the theme on Appearance, each changed in place and saved', async () => {
    const user = userEvent.setup()
    const { router, settingsStore } = await renderApp('/settings/general')
    const language = within(await screen.findByRole('main')).getByRole('radiogroup', {
      name: 'Language',
    })
    expect(within(language).getByRole('radio', { name: 'English' })).toBeChecked()
    await act(() => router.navigate({ to: '/settings/appearance' }))
    // The appearance three small screens (R29), the device's chosen.
    const theme = await screen.findByRole('radiogroup', { name: 'Appearance' })
    expect(within(theme).getByRole('radio', { name: 'Match system' })).toBeChecked()
    await user.click(within(theme).getByRole('radio', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
    await act(() => router.navigate({ to: '/settings/general' }))
    await user.click(await screen.findByRole('radio', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('keeps what the device keeps, the backup and the progress under Storage and backup', async () => {
    await renderApp('/settings/storage')
    await screen.findByRole('region', { name: 'Backup' })
    expect(screen.queryByRole('button', { name: 'Sync now' })).toBeNull()
    // The piano's sound is a group only where the browser keeps caches (StoragePage.test).
    await waitFor(() =>
      expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
        'Device storage',
        'Backup',
      ]),
    )
  })

  it('opens on a laptop as a dialog over the page, its nav beside General, with no Back (R67)', async () => {
    onLaptop()
    await renderApp('/settings')
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    expect(
      await within(dialog).findByRole('heading', { level: 2, name: 'General' }),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('radiogroup', { name: 'App language' })).toBeInTheDocument()
    const nav = within(dialog).getByRole('navigation', { name: 'Settings' })
    expect(within(nav).getByRole('link', { name: 'General' })).toHaveAttribute('data-active')
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('scrolls the laptop dialog’s nav on its own, never with the place open (R67)', async () => {
    onLaptop()
    await renderApp('/settings/storage')
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    expect(within(dialog).getByRole('navigation', { name: 'Settings' })).toHaveClass(
      'overflow-y-auto',
      'overscroll-contain',
    )
  })

  it('marks the place open in the laptop dialog’s nav, with no Back', async () => {
    onLaptop()
    await renderApp('/settings/about')
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    const nav = within(dialog).getByRole('navigation', { name: 'Settings' })
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('data-active')
    expect(within(nav).getByRole('link', { name: 'General' })).not.toHaveAttribute('data-active')
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('says the app’s version on About, beside its tile', async () => {
    await renderApp('/settings/about')
    expect(await screen.findByText(/^Version \d/)).toBeInTheDocument()
  })

  it('says on MIDI devices’ row when the browser cannot connect one', async () => {
    await renderApp('/settings', { webMidi: false })
    const row = await screen.findByRole('link', { name: /^MIDI devices/ })
    expect(row).toHaveTextContent(/MIDI devices\s*Not available/)
  })

  it('reads in Russian, with nothing left in English', async () => {
    for (const path of [
      '/settings',
      '/settings/general',
      '/settings/appearance',
      '/settings/storage',
      '/settings/swipe-actions',
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
    expectLastAndAlone(await screen.findByRole('button', { name: /^Reset progress/ }))
    await user.click(await screen.findByRole('button', { name: /^Reset progress/ }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: /^Reset progress/ }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('says on General the app is up to date, and that it cannot check offline', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/general')
    const update = await screen.findByRole('region', { name: 'Software update' })
    expect(within(update).getByRole('status')).toHaveTextContent('Up to date')
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    await user.click(within(update).getByRole('button', { name: 'Check for updates' }))
    expect(within(update).getByRole('status')).toHaveTextContent('Unavailable offline')
  })

  it('installs a waiting version from Settings, and marks the Profile’s way there', async () => {
    const { skipWaiting } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    const { router } = await renderApp('/profile')
    expect(
      await screen.findByRole('link', { name: 'Settings, Update available' }),
    ).toBeInTheDocument()
    await act(() => router.navigate({ to: '/settings' }))
    expect(await screen.findByRole('link', { name: /^General/ })).toHaveTextContent(
      'Update available',
    )
    await act(() => router.navigate({ to: '/settings/general' }))
    const update = await screen.findByRole('region', { name: 'Software update' })
    expect(within(update).getByRole('status')).toHaveTextContent('Update available')
    await user.click(screen.getByRole('button', { name: 'Install and restart' }))
    await waitFor(() =>
      expect(skipWaiting).toHaveBeenCalledExactlyOnceWith({ type: 'SKIP_WAITING' }),
    )
  })

  it('sends a problem from Support’s Report a problem page with the app’s reports (R32)', async () => {
    const user = userEvent.setup()
    const errors = createFakeErrorReporter()
    const { router } = await renderApp('/settings', { errors })
    await user.click(await screen.findByRole('link', { name: 'Report a problem' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Report a problem' })).toBeVisible()
    const send = screen.getByRole('button', { name: 'Send report' })
    expect(send).toBeDisabled()
    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'The metronome stops at 200',
    )
    await user.click(send)
    expect(errors.sent).toEqual([
      expect.objectContaining({ message: 'Report: The metronome stops at 200' }),
    ])
    expect(await screen.findByText('Report sent. Thank you.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })

  it('cannot send a report offline, and says why', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const user = userEvent.setup()
    await renderApp('/settings/feedback')
    await user.type(await screen.findByRole('textbox', { name: 'Description' }), 'Broken')
    expect(screen.getByRole('button', { name: 'Send report' })).toBeDisabled()
    expect(screen.getByText('You’re offline. Sending needs a connection.')).toBeInTheDocument()
  })
})
