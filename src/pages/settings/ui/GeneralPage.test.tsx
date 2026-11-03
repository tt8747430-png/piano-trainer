import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Settings › General', () => {
  it('chooses the appearance from a card, and saves it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/general')
    const appearance = await screen.findByRole('radiogroup', { name: 'Appearance' })
    await user.click(within(appearance).getByRole('radio', { name: /Dark/ }))
    expect(settingsStore.getState().theme).toBe('dark')
  })

  it('chooses the language from a card', async () => {
    await renderApp('/settings/general')
    const language = await screen.findByRole('radiogroup', { name: 'Language' })
    expect(within(language).getByRole('radio', { name: /English/ })).toBeChecked()
  })

  it('has no lesson reading: it lives on a lesson’s Settings', async () => {
    await renderApp('/settings/general')
    await screen.findByRole('radiogroup', { name: 'Appearance' })
    expect(document.querySelector('[data-setting="lessonReading"]')).toBeNull()
  })
})
