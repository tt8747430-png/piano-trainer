import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

describe('the keyboard’s rail', () => {
  it('holds every control in sight, as pictures: no settings button, no pop-up', () => {
    setUp()
    expect(screen.getByRole('slider', { name: 'Keys in view' })).toBeInTheDocument()
    for (const name of ['Smaller keys', 'Larger keys', 'Glissando', 'Pedal']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.queryByRole('button', { name: 'Keyboard settings' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('zooms the keys a step at a time, saved, the button at an end off', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const smaller = screen.getByRole('button', { name: 'Smaller keys' })
    const larger = screen.getByRole('button', { name: 'Larger keys' })
    await user.click(larger)
    expect(settingsStore.getState().keyboard.keySize).toBe('large')
    expect(larger).toBeDisabled()
    await user.click(smaller)
    await user.click(smaller)
    expect(settingsStore.getState().keyboard.keySize).toBe('piano')
    expect(smaller).toBeDisabled()
    expect(larger).toBeEnabled()
  })

  it('turns the note names round from one button, which says what the keys show', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const names = () => screen.getByRole('button', { name: /^Note names/ })
    expect(names()).toHaveAccessibleName('Note names: every C')
    expect(names()).toHaveAttribute('aria-pressed', 'true')
    await user.click(names())
    expect(names()).toHaveAccessibleName('Note names: every key')
    expect(settingsStore.getState().keyboard.namedKeys).toBe('all')
    await user.click(names())
    expect(names()).toHaveAccessibleName('Note names: off')
    expect(names()).toHaveAttribute('aria-pressed', 'false')
    await user.click(names())
    expect(settingsStore.getState().keyboard.namedKeys).toBe('c')
  })

  it('turns playing from the computer keyboard on and off, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const typing = screen.getByRole('button', { name: 'Play from the computer keyboard' })
    expect(typing).toHaveAttribute('aria-pressed', 'false')
    await user.click(typing)
    expect(typing).toHaveAttribute('aria-pressed', 'true')
    expect(settingsStore.getState().keyboard.typing).toBe(true)
  })

  it('offers Sound the MIDI keyboard only while one is connected, and saves it', async () => {
    const user = userEvent.setup()
    const { settingsStore, midiKeyboard } = setUp()
    const sound = () => screen.queryByRole('button', { name: 'Sound the MIDI keyboard' })
    expect(sound()).not.toBeInTheDocument()
    await act(() => midiKeyboard.connect())
    await user.click(sound() ?? document.body)
    expect(sound()).toHaveAttribute('aria-pressed', 'true')
    expect(settingsStore.getState().midi.sound).toBe(true)
  })

  it('names each button on hover', () => {
    setUp()
    expect(screen.getByRole('button', { name: 'Pedal' })).toHaveAttribute('title', 'Pedal')
  })
})
