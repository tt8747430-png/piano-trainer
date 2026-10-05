import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

describe('GlissandoToggle', () => {
  it('turns glissando on and off from the rail, saving it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const toggle = screen.getByRole('button', { name: 'Glissando' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(settingsStore.getState().keyboard.swipe).toBe('glissando')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(settingsStore.getState().keyboard.swipe).toBe('scroll')
  })
})
