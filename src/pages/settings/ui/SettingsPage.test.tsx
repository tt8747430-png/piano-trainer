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

  it('is one grouped list: the account, General, Playing, Sync and data, Help', async () => {
    await renderApp('/settings')
    expect(
      within(await screen.findByRole('navigation', { name: 'Account' })).getByRole('link'),
    ).toHaveTextContent(/Sign in\s*Keep your songs and progress on every device/)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'General',
      'Playing',
      'Sync and data',
      'Help',
    ])
    expect(
      screen
        .getAllByRole('link')
        .map((row) => row.getAttribute('href'))
        .filter((href) => href?.startsWith('/settings/') || href?.startsWith('/legal/')),
    ).toEqual([
      '/settings/midi',
      '/settings/playing',
      '/settings/data',
      '/settings/how-to-use',
      '/legal/privacy',
      '/legal/terms',
    ])
  })

  it('shows the saved language and theme as chosen, each changed in place and saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    const general = await screen.findByRole('region', { name: 'General' })
    expect(within(general).getByRole('combobox', { name: 'Language' })).toHaveTextContent('English')
    expect(within(general).getByRole('combobox', { name: 'Theme' })).toHaveTextContent('System')
    await user.click(within(general).getByRole('combobox', { name: 'Theme' }))
    await user.click(await screen.findByRole('option', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
    await user.click(within(general).getByRole('combobox', { name: 'Language' }))
    await user.click(await screen.findByRole('option', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('keeps the keyboard and recording on their page, each under its own heading', async () => {
    await renderApp('/settings/playing')
    await screen.findByRole('region', { name: 'Recording' })
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Recording',
      'Keyboard',
    ])
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
    await renderApp('/settings')
    const help = await screen.findByRole('region', { name: 'Help' })
    expect(help).toHaveTextContent(/Version\s*dev/)
  })

  it('stands the floating buttons where chosen and has them say their names, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    const general = await screen.findByRole('region', { name: 'General' })
    await user.click(within(general).getByRole('combobox', { name: 'Floating buttons' }))
    await user.click(await screen.findByRole('option', { name: 'Right' }))
    expect(settingsStore.getState().floating.place).toBe('right')
    await user.click(within(general).getByRole('switch', { name: 'Name the floating buttons' }))
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

  it('says on the MIDI keyboard’s row when the browser cannot connect one', async () => {
    await renderApp('/settings', { webMidi: false })
    const row = (await screen.findByText('MIDI keyboard')).closest('a') as HTMLElement
    expect(row).toHaveTextContent(/MIDI keyboard\s*Not available/)
  })

  it('reads in Russian, with nothing left in English', async () => {
    for (const path of ['/settings', '/settings/playing', '/settings/data']) {
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
