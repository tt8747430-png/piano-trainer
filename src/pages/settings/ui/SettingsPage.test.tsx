import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

describe('Settings', () => {
  it('goes back to the Profile it was opened from', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/profile')
    await user.click(
      within(await screen.findByRole('main')).getByRole('link', { name: 'Settings' }),
    )
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/profile'))
  })

  it('goes back to the Path when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.history.canGoBack()).toBe(false)
  })

  it('shows the saved language and theme as chosen', async () => {
    await renderApp('/settings/preferences')
    expect(await screen.findByRole('radio', { name: 'English' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'true')
  })

  it('opens on the account, then a row to each group’s page', async () => {
    await renderApp('/settings')
    expect(
      within(await screen.findByRole('navigation', { name: 'Account' })).getByRole('link'),
    ).toHaveTextContent(/Sign in\s*Keep your songs and progress on every device/)
    const rows = within(screen.getByRole('navigation', { name: 'Settings' })).getAllByRole('link')
    expect(rows.map((row) => row.getAttribute('href'))).toEqual([
      '/settings/preferences',
      '/settings/playing',
      '/settings/data',
      '/settings/help',
    ])
  })

  it('keeps each group’s settings on its page, each under its own heading', async () => {
    const headings = () => screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    const { unmount } = await renderApp('/settings/preferences')
    const language = await screen.findByRole('radiogroup', { name: 'Language' })
    expect(
      within(language)
        .getAllByRole('radio')
        .map((b) => b.textContent),
    ).toEqual(['English', 'Русский'])
    const theme = screen.getByRole('radiogroup', { name: 'Theme' })
    expect(
      within(theme)
        .getAllByRole('radio')
        .map((b) => b.textContent),
    ).toEqual(['System', 'Light', 'Dark'])
    expect(headings()).toEqual(['Language', 'Theme', 'Appearance'])
    unmount()
    await renderApp('/settings/playing')
    await screen.findByRole('navigation', { name: 'MIDI keyboard' })
    expect(headings()).toEqual(['Recording', 'Keyboard'])
    // How the keys look, where a page’s keys sit, how they play, and the bar over them.
    expect(
      within(screen.getByRole('region', { name: 'Keyboard' }))
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      'How the keys look',
      'Where a page’s keys sit',
      'How they play',
      'The bar over the keys',
    ])
  })

  it('keeps the sync, what the device keeps, the backup and the progress under Sync and data', async () => {
    await renderApp('/settings/data')
    await screen.findByRole('region', { name: 'Sync' })
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Sync',
      'On this device',
      'Backup',
      'Progress',
    ])
  })

  it('says the app’s version under Help', async () => {
    await renderApp('/settings/help')
    const about = await screen.findByRole('region', { name: 'About' })
    expect(about).toHaveTextContent(/Version\s*dev/)
    expect(screen.getByRole('link', { name: /How to use/ })).toHaveAttribute(
      'href',
      '/settings/how-to-use',
    )
  })

  it('stands the floating buttons where chosen and has them say their names, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/preferences')
    await user.click(await screen.findByRole('radio', { name: 'Right' }))
    expect(settingsStore.getState().floating.place).toBe('right')
    const appearance = screen.getByRole('region', { name: 'Appearance' })
    await user.click(within(appearance).getByRole('switch', { name: 'Name the floating buttons' }))
    expect(settingsStore.getState().floating.labels).toBe(true)
  })

  it('keeps how a take is recorded under Recording: the metronome and the tune, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/playing')
    const recording = await screen.findByRole('region', { name: 'Recording' })
    await user.click(within(recording).getByRole('switch', { name: 'Metronome' }))
    await user.click(within(recording).getByRole('switch', { name: 'Play melody' }))
    expect(settingsStore.getState().recorder).toEqual({ click: false, tune: true })
    await user.click(within(recording).getByRole('button', { name: 'About Metronome' }))
    expect(await screen.findByRole('dialog', { name: 'Metronome' })).toHaveTextContent(
      'The beat goes on after the count-in',
    )
  })

  it('says what a backup holds beside its heading, never in a line under it', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/data')
    const backup = await screen.findByRole('region', { name: 'Backup' })
    expect(backup).not.toHaveTextContent('live on this device only')
    await user.click(within(backup).getByRole('button', { name: 'About Backup' }))
    expect(await screen.findByRole('dialog', { name: 'Backup' })).toHaveTextContent(
      'live on this device only',
    )
  })

  it('sets up the keyboard, and saves each change', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/playing')
    const keys = await screen.findByRole('radiogroup', { name: 'Key size' })
    await user.click(within(keys).getByRole('radio', { name: 'Large' }))
    await user.click(screen.getByRole('switch', { name: /^Play from the computer keyboard/ }))
    await user.click(screen.getByRole('switch', { name: /^Name the chords played/ }))
    const swipe = screen.getByRole('radiogroup', { name: 'A swipe on the keys' })
    await user.click(within(swipe).getByRole('radio', { name: 'Plays' }))
    expect(settingsStore.getState().keyboard).toMatchObject({
      keySize: 'large',
      typing: true,
      chordNames: false,
      swipe: 'glissando',
    })
  })

  it('says what a keyboard choice does in a popover beside its name, never in a line under it', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/playing')
    await user.click(await screen.findByRole('button', { name: 'About Key size' }))
    expect(await screen.findByRole('dialog', { name: 'Key size' })).toHaveTextContent(
      /fills the width/,
    )
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText(/fills the width/)).toBeNull())
  })

  it('keeps on the bar over the keys only the buttons chosen, in the bar’s order', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/playing')
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

  it('saves a new language', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/preferences')
    await user.click(await screen.findByRole('radio', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('saves a new theme', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/preferences')
    await user.click(await screen.findByRole('radio', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
  })

  it('says on the MIDI keyboard’s row when the browser cannot connect one', async () => {
    await renderApp('/settings/playing', { webMidi: false })
    const row = within(await screen.findByRole('navigation', { name: 'MIDI keyboard' }))
    expect(row.getByRole('link')).toHaveTextContent(/MIDI keyboard\s*Not available/)
  })

  it('reads in Russian, with nothing left in English', async () => {
    for (const path of [
      '/settings',
      '/settings/preferences',
      '/settings/playing',
      '/settings/data',
      '/settings/help',
    ]) {
      const { unmount } = await renderApp(path, { locale: 'ru' })
      await screen.findByRole('heading', { level: 1 })
      expect(untranslated(document.body)).toEqual([])
      unmount()
    }
  })

  it('resets progress only after confirming, then closes the dialog', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/settings/data')
    act(() => progressStore.setState({ learned: { 'chords:tri': '2026-09-25T10:00:00Z' } }))
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(screen.getByRole('button', { name: 'Keep it' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })
})
