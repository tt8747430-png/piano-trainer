import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './store'
import { DEFAULT_PRACTICE, DEFAULT_QUIZ_CHOICE, defaultKeyboard } from './types'

/** Puts settings in storage as an earlier session would have saved them. */
const writeSaved = (storage: Storage, state: unknown, version = 2) =>
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ state, version }))

const restored = (state: unknown, version = 2) => {
  const storage = createMemoryStorage()
  writeSaved(storage, state, version)
  return createSettingsStore({ storage, languages: ['en'] }).getState()
}

// The test setup's matchMedia answers false: no fine pointer, so no typing by default.
const DEFAULTS = {
  practice: DEFAULT_PRACTICE,
  quiz: DEFAULT_QUIZ_CHOICE,
  keyboard: defaultKeyboard(false),
}

describe('createSettingsStore', () => {
  it('starts on the system theme, the browser language, no toggles and the default quiz', () => {
    const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['ru-RU'] })
    expect(store.getState()).toEqual({ theme: 'system', locale: 'ru', ...DEFAULTS })
    expect(DEFAULT_PRACTICE).toEqual({
      fingerNumbers: false,
      melody: false,
      metronome: false,
      countIn: false,
    })
    expect(DEFAULT_QUIZ_CHOICE).toEqual({
      families: ['sev', 'nin'],
      scales: ['major', 'natural', 'harmonic'],
    })
  })

  it('saves under pt-settings with its version', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    store.setState({ theme: 'dark' })
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual({
      state: { theme: 'dark', locale: 'en', ...DEFAULTS },
      version: 3,
    })
  })

  it('restores what was saved', () => {
    const saved = {
      theme: 'light',
      locale: 'ru',
      practice: { fingerNumbers: true, melody: false, metronome: true, countIn: false },
      quiz: { families: ['tri'], scales: ['blues'] },
      keyboard: {
        keySize: 'large',
        swipe: 'glissando',
        namedKeys: 'none',
        map: true,
        typing: true,
      },
    }
    expect(restored(saved, 3)).toEqual(saved)
  })

  it('plays from the computer keyboard by default only where the pointer is fine', () => {
    const keyboard = (finePointer: boolean) =>
      createSettingsStore({
        storage: createMemoryStorage(),
        languages: ['en'],
        finePointer,
      }).getState().keyboard
    expect(keyboard(true)).toEqual({
      keySize: 'fit',
      swipe: 'scroll',
      namedKeys: 'c',
      map: false,
      typing: true,
    })
    expect(keyboard(false).typing).toBe(false)
  })

  it('gives a version-2 save the keyboard’s defaults and keeps the rest', () => {
    const saved = {
      theme: 'dark',
      locale: 'ru',
      practice: DEFAULT_PRACTICE,
      quiz: DEFAULT_QUIZ_CHOICE,
    }
    expect(restored(saved)).toEqual({ theme: 'dark', locale: 'ru', ...DEFAULTS })
  })

  it('restores the keyboard settings, an unknown value taking its default alone', () => {
    const keyboard = {
      keySize: 'huge',
      swipe: 'glissando',
      namedKeys: 'all',
      map: 'yes',
      typing: true,
    }
    expect(restored({ theme: 'light', locale: 'en', keyboard }, 3).keyboard).toEqual({
      keySize: 'fit',
      swipe: 'glissando',
      namedKeys: 'all',
      map: false,
      typing: true,
    })
  })

  it('gives a version 1 save the new defaults, keeping its theme and language', () => {
    expect(restored({ theme: 'dark', locale: 'ru' }, 1)).toEqual({
      theme: 'dark',
      locale: 'ru',
      ...DEFAULTS,
    })
  })

  it('keeps valid saved fields and defaults the ones it does not recognise', () => {
    expect(restored({ theme: 'sepia', locale: 'ru', extra: true })).toEqual({
      theme: 'system',
      locale: 'ru',
      ...DEFAULTS,
    })
  })

  it('turns a toggle that is not a boolean off', () => {
    expect(restored({ practice: { metronome: 'yes', countIn: true } }).practice).toEqual({
      ...DEFAULT_PRACTICE,
      countIn: true,
    })
  })

  it('keeps the known families and scales once each, in order, and the default for none', () => {
    const choice = (quiz: unknown) => restored({ quiz }).quiz
    expect(choice({ families: ['sev', 'bogus', 'sev'], scales: ['blues', 'major'] })).toEqual({
      families: ['sev'],
      scales: ['major', 'blues'],
    })
    expect(choice({ families: [], scales: 'major' })).toEqual(DEFAULT_QUIZ_CHOICE)
  })

  it('starts fresh, without throwing, when the saved JSON is corrupt', () => {
    const storage = createMemoryStorage()
    storage.setItem(SETTINGS_STORAGE_KEY, '{oops')
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'system',
      locale: 'en',
      ...DEFAULTS,
    })
  })

  it('keeps a theme saved by an older version', () => {
    expect(restored({ theme: 'dark' }, 0).theme).toBe('dark')
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
