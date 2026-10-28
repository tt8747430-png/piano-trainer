import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { setMidi } from '@/features/set-preference'
import { midi as key } from '@/shared/lib/music'

const midiRow = () =>
  within(screen.getByRole('navigation', { name: 'MIDI keyboard' })).getByRole('link')

describe('Settings › MIDI keyboard', () => {
  it('is a row of Settings that shows its state at its right and opens the MIDI screen', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    await screen.findByRole('navigation', { name: 'MIDI keyboard' })
    expect(midiRow()).toHaveTextContent(/MIDI keyboard\s*Off/)
    await user.click(midiRow())
    expect(await screen.findByRole('heading', { level: 1, name: 'MIDI keyboard' })).toBeVisible()
    expect(router.state.location.pathname).toBe('/settings/midi')
  })

  it('names the keyboard connected in the Settings row', async () => {
    const { midi } = await renderApp('/settings')
    await screen.findByRole('navigation', { name: 'MIDI keyboard' })
    await act(() => midi.connect())
    expect(midiRow()).toHaveTextContent(/MIDI keyboard\s*Keyboard/)
  })

  it('turns MIDI input on, lists the keyboard, and sets it up', async () => {
    const user = userEvent.setup()
    const { settingsStore, midi } = await renderApp('/settings/midi')
    const input = await screen.findByRole('switch', { name: 'MIDI input' })
    expect(input).not.toBeChecked()
    expect(screen.getByText('Turn on MIDI input to see your devices')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'MIDI output' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(
      screen.getByRole('switch', { name: 'MIDI input plays sound' }),
    ).toHaveAccessibleDescription('Needs MIDI input')
    await user.click(input)
    await waitFor(() => expect(input).toBeChecked())
    expect(midi.current()).toEqual({ state: 'connected', devices: ['Keyboard'] })
    const devices = screen.getByRole('listbox', { name: 'Connected devices' })
    expect(within(devices).getByRole('option', { name: /Any keyboard/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await user.click(within(devices).getByRole('option', { name: /^Keyboard/ }))
    await user.click(screen.getByRole('switch', { name: 'MIDI output' }))
    await user.click(screen.getByRole('switch', { name: 'MIDI input plays sound' }))
    const choose = (group: string, value: string) =>
      user.click(
        within(screen.getByRole('radiogroup', { name: group })).getByRole('radio', { name: value }),
      )
    await choose('Octave shift', '+1')
    await choose('Touch', 'Light')
    await choose('Pedal', 'Reversed')
    expect(settingsStore.getState().midi).toEqual({
      input: true,
      device: 'Keyboard',
      sound: true,
      throughPiano: true,
      octaveShift: 1,
      touch: 'light',
      pedal: 'reversed',
    })
  })

  it('turns MIDI input off: the keyboard is no longer heard, nor reconnected as the app opens', async () => {
    const user = userEvent.setup()
    const { settingsStore, midi } = await renderApp('/settings/midi')
    await act(() => midi.connect())
    const input = await screen.findByRole('switch', { name: 'MIDI input' })
    expect(input).toBeChecked()
    await user.click(input)
    expect(midi.current()).toEqual({ state: 'off' })
    expect(settingsStore.getState().midi.input).toBe(false)
    expect(screen.getByText('Turn on MIDI input to see your devices')).toBeInTheDocument()
  })

  it('says no device is connected, with an empty state', async () => {
    const { midi } = await renderApp('/settings/midi')
    await screen.findByRole('switch', { name: 'MIDI input' })
    act(() => midi.setStatus({ state: 'no-device' }))
    expect(await screen.findByText('No MIDI devices connected')).toBeInTheDocument()
  })

  it('keeps a keyboard chosen while it is away, and hears any keyboard once chosen', async () => {
    const user = userEvent.setup()
    const { settingsStore, midi } = await renderApp('/settings/midi')
    await screen.findByRole('switch', { name: 'MIDI input' })
    act(() => setMidi(settingsStore, { device: 'Piano' }))
    act(() => midi.setStatus({ state: 'away', device: 'Piano', devices: ['Keyboard'] }))
    const devices = await screen.findByRole('listbox', { name: 'Connected devices' })
    expect(within(devices).getByRole('option', { name: /Piano\s*Not connected/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await user.click(within(devices).getByRole('option', { name: /Any keyboard/ }))
    expect(settingsStore.getState().midi.device).toBeNull()
  })

  it('greys everything, saying why, where the browser has no Web MIDI', async () => {
    await renderApp('/settings/midi', { webMidi: false })
    expect(
      await screen.findByText('This browser can’t connect a MIDI keyboard.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'MIDI input' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(
      within(screen.getByRole('radiogroup', { name: 'Octave shift' })).getByRole('radio', {
        name: '+1',
      }),
    ).toHaveAttribute('data-disabled')
  })

  it('says MIDI access was blocked, its ⓘ how to allow it', async () => {
    const { midi } = await renderApp('/settings/midi')
    await screen.findByRole('switch', { name: 'MIDI input' })
    act(() => midi.setStatus({ state: 'denied' }))
    expect(await screen.findByText('MIDI access was blocked.')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'MIDI input' })).not.toBeChecked()
  })

  it('shows how a Bluetooth keyboard pairs', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/midi')
    await user.click(
      await screen.findByRole('button', { name: 'Connect a Bluetooth MIDI keyboard' }),
    )
    expect(await screen.findByRole('dialog')).toHaveTextContent(/Audio MIDI Setup/)
  })

  it('logs what the keyboard sends, live, and pauses and clears the log', async () => {
    const user = userEvent.setup()
    const { router, midi } = await renderApp('/settings/midi')
    await act(() => midi.connect())
    act(() => midi.press(key(60), { velocity: 90 }))
    const row = await screen.findByRole('link', { name: /MIDI log/ })
    expect(row).toHaveTextContent('1 message')
    await user.click(row)
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/midi/log'))
    const log = await screen.findByRole('list', { name: 'MIDI log' })
    expect(within(log).getByRole('listitem')).toHaveTextContent(
      /Note on C4\s*Velocity 90 · Channel 1 · Keyboard/,
    )
    act(() => midi.pedal(true))
    expect(within(log).getAllByRole('listitem')[0]).toHaveTextContent(/Sustain pedal down/)
    await user.click(screen.getByRole('button', { name: 'Pause' }))
    act(() => midi.release(key(60)))
    expect(within(log).getAllByRole('listitem')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Resume' }))
    expect(within(log).getAllByRole('listitem')).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(await screen.findByText('Play a key or a pedal: each message shows here')).toBeVisible()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/settings/midi', { locale: 'ru' })
    await screen.findByRole('radiogroup', { name: 'Сдвиг октавы' })
    expect(untranslated(document.body)).toEqual([])
  })
})
