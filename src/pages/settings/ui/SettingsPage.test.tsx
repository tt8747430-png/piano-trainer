import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { setMidi } from '@/features/set-preference'

describe('Settings', () => {
  it('goes back to the Path it was opened from, leaving no Settings to come back to', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/')
    await user.click(
      within(await screen.findByRole('main')).getByRole('link', { name: 'Settings' }),
    )
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.history.canGoBack()).toBe(false)
  })

  it('goes back to the Path when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.history.canGoBack()).toBe(false)
  })

  it('shows the saved language and theme as chosen', async () => {
    await renderApp('/settings')
    expect(await screen.findByRole('radio', { name: 'English' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'true')
  })

  it('groups the settings as an app’s settings page reads, each under its own heading', async () => {
    await renderApp('/settings')
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
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings.slice(headings.indexOf('Language'))).toEqual([
      'Language',
      'Theme',
      'Appearance',
      'Keyboard',
      'MIDI keyboard',
      'Recording',
      'Backup',
      'Progress',
    ])
    // How the keys look, where a page's keys sit, how they play, and the bar over them.
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

  it('stands the floating buttons where chosen and has them say their names, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Right' }))
    expect(settingsStore.getState().floating.place).toBe('right')
    const appearance = screen.getByRole('region', { name: 'Appearance' })
    await user.click(within(appearance).getByRole('switch', { name: 'Name the floating buttons' }))
    expect(settingsStore.getState().floating.labels).toBe(true)
  })

  it('keeps how a take is recorded under Recording: the metronome and the tune, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    const recording = await screen.findByRole('region', { name: 'Recording' })
    await user.click(within(recording).getByRole('switch', { name: 'Metronome' }))
    await user.click(within(recording).getByRole('switch', { name: 'Tune' }))
    expect(settingsStore.getState().recorder).toEqual({ click: false, tune: true })
    await user.click(within(recording).getByRole('button', { name: 'About Metronome' }))
    expect(await screen.findByRole('dialog', { name: 'Metronome' })).toHaveTextContent(
      'The beat goes on after the count-in',
    )
  })

  it('says what a backup holds beside its heading, never in a line under it', async () => {
    const user = userEvent.setup()
    await renderApp('/settings')
    const backup = await screen.findByRole('region', { name: 'Backup' })
    expect(backup).not.toHaveTextContent('live on this device only')
    await user.click(within(backup).getByRole('button', { name: 'About Backup' }))
    expect(await screen.findByRole('dialog', { name: 'Backup' })).toHaveTextContent(
      'live on this device only',
    )
  })

  it('makes every screen’s title small, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    const titles = await screen.findByRole('radiogroup', { name: 'Page titles' })
    await user.click(within(titles).getByRole('radio', { name: 'Small' }))
    expect(settingsStore.getState().titles).toBe('small')
    expect(document.documentElement.dataset['titles']).toBe('small')
  })

  it('sets up the keyboard, and saves each change', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
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
    await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'About Key size' }))
    expect(await screen.findByRole('dialog', { name: 'Key size' })).toHaveTextContent(
      /fills the width/,
    )
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText(/fills the width/)).toBeNull())
  })

  it('keeps on the bar over the keys only the buttons chosen, in the bar’s order', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
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
    const { settingsStore } = await renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('saves a new theme', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
  })

  it('says in one line when the browser cannot connect a keyboard', async () => {
    await renderApp('/settings', { webMidi: false })
    expect(
      await screen.findByText('This browser can’t connect a MIDI keyboard.'),
    ).toBeInTheDocument()
  })

  it('sets up the MIDI keyboard under its connection, and saves each change', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Connect a MIDI keyboard' }))
    await user.click(await screen.findByRole('combobox', { name: 'Listen to' }))
    await user.click(await screen.findByRole('option', { name: 'Keyboard' }))
    await user.click(screen.getByRole('switch', { name: /Sound the MIDI keyboard/ }))
    await user.click(screen.getByRole('switch', { name: /Play the app’s music on the keyboard/ }))
    const choose = (group: string, value: string) =>
      user.click(
        within(screen.getByRole('radiogroup', { name: group })).getByRole('radio', { name: value }),
      )
    await choose('Octave shift', '+1')
    await choose('Touch', 'Light')
    await choose('Pedal', 'Reversed')
    expect(settingsStore.getState().midi).toEqual({
      device: 'Keyboard',
      sound: true,
      throughPiano: true,
      octaveShift: 1,
      touch: 'light',
      pedal: 'reversed',
    })
    expect(screen.getByText('Connected: Keyboard')).toBeInTheDocument()
  })

  it('keeps a keyboard chosen while it is away, and says it is not connected', async () => {
    const user = userEvent.setup()
    const { settingsStore, midi } = await renderApp('/settings')
    act(() => setMidi(settingsStore, { device: 'Piano' }))
    act(() => midi.setStatus({ state: 'away', device: 'Piano', devices: ['Keyboard'] }))
    expect(await screen.findByText('Piano is not connected.')).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Listen to' }))
    expect(await screen.findByRole('option', { name: 'Piano (not connected)' })).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Any keyboard' }))
    expect(settingsStore.getState().midi.device).toBeNull()
  })

  it('shows no MIDI settings where the browser cannot connect a keyboard', async () => {
    await renderApp('/settings', { webMidi: false })
    await screen.findByText('This browser can’t connect a MIDI keyboard.')
    expect(screen.queryByRole('radiogroup', { name: 'Octave shift' })).not.toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/settings', { locale: 'ru' })
    await screen.findByRole('radiogroup', { name: 'Сдвиг октавы' })
    expect(untranslated(document.body)).toEqual([])
  })

  it('resets progress only after confirming, then closes the dialog', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/settings')
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
