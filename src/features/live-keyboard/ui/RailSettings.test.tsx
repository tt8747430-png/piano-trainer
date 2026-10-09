import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

describe('RailSettings', () => {
  it('sets the keyboard settings from the rail, each in sight and saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const rail = screen.getByRole('group', { name: 'Keyboard settings' })
    await user.click(within(rail).getByRole('radio', { name: 'Large' }))
    await user.click(within(rail).getByRole('radio', { name: 'All' }))
    await user.click(within(rail).getByRole('button', { name: 'Keyboard map' }))
    await user.click(within(rail).getByRole('button', { name: /Play from the computer keyboard/ }))
    expect(settingsStore.getState().keyboard).toEqual({
      keySize: 'large',
      swipe: 'scroll',
      namedKeys: 'all',
      map: true,
      typing: true,
    })
    expect(within(rail).getByRole('button', { name: 'Keyboard map' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('slider', { name: 'Keys in view' })).toBeInTheDocument()
  })

  it('offers Sound the MIDI keyboard only while one is connected, and saves it', async () => {
    const user = userEvent.setup()
    const { settingsStore, midiKeyboard } = setUp()
    const rail = screen.getByRole('group', { name: 'Keyboard settings' })
    const sound = () => within(rail).queryByRole('button', { name: 'Sound the MIDI keyboard' })
    expect(sound()).not.toBeInTheDocument()
    await act(() => midiKeyboard.connect())
    await user.click(sound() ?? rail)
    expect(sound()).toHaveAttribute('aria-pressed', 'true')
    expect(settingsStore.getState().midi.sound).toBe(true)
  })

  it('opens them in the rail on a narrow screen from the settings button, no pop-up', async () => {
    const user = userEvent.setup()
    setUp()
    const button = screen.getByRole('button', { name: 'Keyboard settings' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
