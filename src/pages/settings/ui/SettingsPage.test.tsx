import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { stubMatchMedia } from '@/shared/test/match-media'
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
      'Sign in Sync your library across your devices',
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
      '/settings/storage',
      '/settings/on-screen-piano',
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

  it('shows the saved language and theme on General, each changed in place and saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/general')
    const general = await screen.findByRole('main')
    const language = within(general).getByRole('radiogroup', { name: 'Language' })
    expect(within(language).getByRole('radio', { name: 'English' })).toBeChecked()
    // The appearance a card of three (R29), the device's chosen.
    const theme = within(general).getByRole('radiogroup', { name: 'Appearance' })
    expect(within(theme).getByRole('radio', { name: 'Match system' })).toBeChecked()
    await user.click(within(theme).getByRole('radio', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
    await user.click(within(language).getByRole('radio', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('keeps the on-screen piano on its page, each group under its own heading', async () => {
    await renderApp('/settings/on-screen-piano')
    expect(await screen.findByRole('heading', { level: 1, name: 'On-screen piano' })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Keys',
      'While you play',
      'Placement',
    ])
    expect(screen.queryByRole('switch', { name: /^Play with computer keyboard/ })).toBeNull()
  })

  it('keeps what the device keeps, the backup and the progress under Storage and backup', async () => {
    await renderApp('/settings/storage')
    await screen.findByRole('region', { name: 'Backup' })
    expect(screen.queryByRole('button', { name: 'Sync now' })).toBeNull()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Device storage',
      'Backup',
    ])
  })

  it('stands in two panes on a laptop: the sidebar beside General, neither with Back (R32)', async () => {
    onLaptop()
    const { router } = await renderApp('/settings')
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/general'))
    expect(await screen.findByRole('heading', { level: 1, name: 'General' })).toBeInTheDocument()
    const sidebar = screen.getByRole('complementary', { name: 'Settings' })
    expect(screen.getByRole('radiogroup', { name: 'Language' })).toBeInTheDocument()
    expect(within(sidebar).getByRole('link', { name: 'General' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('scrolls the laptop’s sidebar on its own, never with the page (R32, the owner’s bug)', async () => {
    onLaptop()
    await renderApp('/settings/storage')
    const sidebar = await screen.findByRole('complementary', { name: 'Settings' })
    // Sticky under the bar, no taller than the window, its own scroller: as Songs' tree.
    expect(sidebar).toHaveClass('sticky', 'top-20', 'max-h-[calc(100dvh-6rem)]', 'overflow-y-auto')
  })

  it('marks the page a page is under on a laptop, and keeps that page’s Back', async () => {
    onLaptop()
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/about')
    const sidebar = await screen.findByRole('complementary', { name: 'Settings' })
    expect(within(sidebar).getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    // About on a laptop (the owner's bug): beside the sidebar, with no dead Back.
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
    await user.click(screen.getByRole('link', { name: 'Privacy Policy' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()
    expect(
      within(screen.getByRole('complementary', { name: 'Settings' })).getByRole('link', {
        name: 'About',
      }),
    ).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/about'))
  })

  it('draws a page Settings does not list alone, with Back, on a laptop', async () => {
    onLaptop()
    await renderApp('/settings/chord-finder')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('complementary', { name: 'Settings' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('says the app’s version on About’s row', async () => {
    await renderApp('/settings')
    const about = await screen.findByRole('link', { name: /^About/ })
    expect(about.querySelector('[data-slot="row-value"]')?.textContent).toMatch(/\d/)
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
    stubMatchMedia({ dark: false, pointer: 'fine' })
    const user = userEvent.setup()
    const { settingsStore, router } = await renderApp('/settings/on-screen-piano')
    const keys = await screen.findByRole('radiogroup', { name: 'Key size' })
    await user.click(within(keys).getByRole('radio', { name: 'Large' }))
    await user.click(screen.getByRole('switch', { name: /^Chord symbol/ }))
    const swipe = screen.getByRole('radiogroup', { name: 'Swipe gesture' })
    await user.click(within(swipe).getByRole('radio', { name: 'Glissando' }))
    // Collapse keyboard: the two saved folds as one choice of three (R21).
    const fold = screen.getByRole('radiogroup', { name: 'Collapse keyboard' })
    expect(within(fold).getByRole('radio', { name: 'In landscape' })).toBeChecked()
    await user.click(within(fold).getByRole('radio', { name: 'Always' }))
    expect(settingsStore.getState().keyboard).toMatchObject({ folded: true })
    await user.click(within(fold).getByRole('radio', { name: 'Never' }))
    expect(settingsStore.getState().keyboard).toMatchObject({
      folded: false,
      foldedLandscape: false,
    })
    await act(() => router.navigate({ to: '/settings/computer-keys' }))
    await user.click(await screen.findByRole('switch', { name: /^Play with computer keyboard/ }))
    expect(settingsStore.getState().keyboard).toMatchObject({
      keySize: 'large',
      typing: true,
      chordNames: false,
      swipe: 'glissando',
    })
  })

  it('says what each keyboard choice does in one line under its name (R32)', async () => {
    await renderApp('/settings/on-screen-piano')
    expect(
      await screen.findByText('How many keys fit across the screen; the rest scroll into view.'),
    ).toBeVisible()
    expect(screen.getByRole('switch', { name: /^Chord symbol/ })).toHaveAccessibleDescription(
      'Names the chord you hold at the start of the pedal rail.',
    )
  })

  it('draws the sustain pedal, or all three, as chosen (R31-P)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/on-screen-piano')
    expect(settingsStore.getState().keyboard.pedals).toBe('sustain')
    await user.click(await screen.findByRole('radio', { name: 'All three' }))
    expect(settingsStore.getState().keyboard.pedals).toBe('all')
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
      '/settings/on-screen-piano',
      '/settings/computer-keys',
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
    expectLastAndAlone(await screen.findByRole('button', { name: /^Reset progress/ }))
    await user.click(await screen.findByRole('button', { name: /^Reset progress/ }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: /^Reset progress/ }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('says on About the app is up to date, and that it cannot check offline', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/about')
    const update = await screen.findByRole('button', { name: /^Software update/ })
    expect(update).toHaveTextContent('Up to date')
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    await user.click(update)
    expect(update).toHaveTextContent('Unavailable offline')
  })

  it('installs a waiting version from Settings, and marks the Profile’s way there', async () => {
    const { skipWaiting } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    const { router } = await renderApp('/profile')
    expect(
      await screen.findByRole('link', { name: 'Settings, Update available' }),
    ).toBeInTheDocument()
    await act(() => router.navigate({ to: '/settings' }))
    expect(await screen.findByRole('link', { name: /^About/ })).toHaveTextContent(
      'Update available',
    )
    await act(() => router.navigate({ to: '/settings/about' }))
    expect(await screen.findByRole('button', { name: /^Software update/ })).toHaveTextContent(
      'Update available',
    )
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
    expect(screen.getByText('Sending requires an internet connection.')).toBeInTheDocument()
  })
})
