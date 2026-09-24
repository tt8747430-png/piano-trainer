import { act, render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, type Locale, SettingsStoreProvider } from '@/entities/settings'
import { setLocale } from '@/features/set-preference'
import { i18n } from '@/shared/i18n'
import { createMemoryStorage } from '@/shared/lib'
import { LocaleSync } from './LocaleSync'

function renderWith(locale: Locale) {
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: [locale] })
  render(
    <SettingsStoreProvider store={store}>
      <LocaleSync />
    </SettingsStoreProvider>,
  )
  return store
}

describe('LocaleSync', () => {
  it('puts i18next and <html lang> on the saved language', async () => {
    renderWith('ru')
    await waitFor(() => expect(i18n.language).toBe('ru'))
    expect(document.documentElement.lang).toBe('ru')
  })

  it('follows a change of language', async () => {
    const store = renderWith('en')
    act(() => setLocale(store, 'ru'))
    await waitFor(() => expect(i18n.language).toBe('ru'))
    expect(document.documentElement.lang).toBe('ru')
  })
})
