import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

describe('KeyboardSettingsButton', () => {
  it('opens the keyboard settings from the rail and saves each change', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    await user.click(screen.getByRole('button', { name: 'Keyboard settings' }))
    const popover = await screen.findByRole('dialog', { name: 'Keyboard settings' })
    await user.click(within(popover).getByRole('button', { name: 'Large' }))
    await user.click(within(popover).getByRole('button', { name: 'Glissando' }))
    await user.click(within(popover).getByRole('button', { name: 'All' }))
    await user.click(within(popover).getByRole('switch', { name: 'Keyboard map' }))
    await user.click(
      within(popover).getByRole('switch', { name: /Play from the computer keyboard/ }),
    )
    expect(settingsStore.getState().keyboard).toEqual({
      keySize: 'large',
      swipe: 'glissando',
      namedKeys: 'all',
      map: true,
      typing: true,
    })
    expect(within(popover).getByText('Z X · octave')).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Keys in view' })).toBeInTheDocument()
  })
})
