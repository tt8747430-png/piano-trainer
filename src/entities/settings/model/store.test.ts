import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './store'

/** Puts settings in storage as an earlier session would have saved them. */
const writeSaved = (storage: Storage, state: unknown, version = 1) =>
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ state, version }))

describe('createSettingsStore', () => {
  it('starts on the system theme and the browser language', () => {
    const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['ru-RU'] })
    expect(store.getState()).toEqual({ theme: 'system', locale: 'ru' })
  })

  it('saves under pt-settings with its version', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    store.setState({ theme: 'dark' })
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual({
      state: { theme: 'dark', locale: 'en' },
      version: 1,
    })
  })

  it('restores what was saved', () => {
    const storage = createMemoryStorage()
    writeSaved(storage, { theme: 'light', locale: 'ru' })
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'light',
      locale: 'ru',
    })
  })

  it('keeps valid saved fields and defaults the ones it does not recognise', () => {
    const storage = createMemoryStorage()
    writeSaved(storage, { theme: 'sepia', locale: 'ru', extra: true })
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'system',
      locale: 'ru',
    })
  })

  it('starts fresh, without throwing, when the saved JSON is corrupt', () => {
    const storage = createMemoryStorage()
    storage.setItem(SETTINGS_STORAGE_KEY, '{oops')
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'system',
      locale: 'en',
    })
  })

  it('keeps a theme saved by an older version', () => {
    const storage = createMemoryStorage()
    writeSaved(storage, { theme: 'dark' }, 0)
    expect(createSettingsStore({ storage, languages: ['en'] }).getState().theme).toBe('dark')
  })

  it('works on blocked storage, holding choices for the session', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    const store = createSettingsStore({ languages: ['en'] })
    expect(() => store.setState({ theme: 'dark' })).not.toThrow()
    expect(store.getState().theme).toBe('dark')
  })
})
