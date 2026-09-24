import { describe, expect, it } from 'vitest'
import { createSettingsStore } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { setLocale, setTheme } from './index'

describe('set-preference', () => {
  it('setTheme changes and saves the theme', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    setTheme(store, 'dark')
    expect(store.getState().theme).toBe('dark')
    expect(storage.getItem('pt-settings')).toContain('"theme":"dark"')
  })

  it('setLocale changes and saves the language', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    setLocale(store, 'ru')
    expect(store.getState().locale).toBe('ru')
    expect(storage.getItem('pt-settings')).toContain('"locale":"ru"')
  })
})
