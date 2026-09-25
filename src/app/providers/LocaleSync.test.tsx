import { act, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setLocale } from '@/features/set-preference'
import { i18n, type Locale } from '@/shared/i18n'
import { renderWithSettings } from '../testing/render-with-settings'
import { LocaleSync } from './LocaleSync'

const renderWith = (locale: Locale) => renderWithSettings(<LocaleSync />, { locale }).settingsStore

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

  it('names the page in the saved language', () => {
    const store = renderWith('ru')
    expect(document.title).toBe('Тренажёр фортепиано')
    act(() => setLocale(store, 'en'))
    expect(document.title).toBe('Piano Trainer')
  })
})
