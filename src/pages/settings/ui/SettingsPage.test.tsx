import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, type Locale, SettingsStoreProvider } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { SettingsPage } from './SettingsPage'

function renderPage(locale: Locale = 'en') {
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: [locale] })
  render(
    <SettingsStoreProvider store={store}>
      <SettingsPage />
    </SettingsStoreProvider>,
  )
  return store
}

describe('SettingsPage', () => {
  it('shows the saved language and theme as chosen', () => {
    renderPage('en')
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked()
  })

  it('groups each choice under its own heading', () => {
    renderPage()
    const language = screen.getByRole('group', { name: 'Language' })
    expect(
      within(language)
        .getAllByRole('radio')
        .map((radio) => radio.getAttribute('value')),
    ).toEqual(['en', 'ru'])
    const theme = screen.getByRole('group', { name: 'Theme' })
    expect(
      within(theme)
        .getAllByRole('radio')
        .map((radio) => radio.getAttribute('value')),
    ).toEqual(['system', 'light', 'dark'])
  })

  it('saves a new language', async () => {
    const user = userEvent.setup()
    const store = renderPage()
    await user.click(screen.getByRole('radio', { name: 'Русский' }))
    expect(store.getState().locale).toBe('ru')
  })

  it('saves a new theme', async () => {
    const user = userEvent.setup()
    const store = renderPage()
    await user.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(store.getState().theme).toBe('dark')
  })
})
