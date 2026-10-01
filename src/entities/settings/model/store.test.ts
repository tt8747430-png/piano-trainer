import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './store'
import { DEFAULT_PRACTICE, DEFAULT_TRAINER, defaultKeyboard } from './types'

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
  trainer: DEFAULT_TRAINER,
  keyboard: defaultKeyboard(false),
}

describe('createSettingsStore', () => {
  it('starts on the system theme, the browser language, no toggles and no auto-next', () => {
    const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['ru-RU'] })
    expect(store.getState()).toEqual({ theme: 'system', locale: 'ru', ...DEFAULTS })
    expect(DEFAULT_PRACTICE).toEqual({
      fingerNumbers: false,
      namedNotes: false,
      melody: false,
      metronome: false,
      countIn: false,
      recording: true,
    })
    expect(DEFAULT_TRAINER).toEqual({ autoNext: false })
  })

  it('saves under pt-settings with its version', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    store.setState({ theme: 'dark' })
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual({
      state: { theme: 'dark', locale: 'en', ...DEFAULTS },
      version: 6,
    })
  })

  it('restores what was saved', () => {
    const saved = {
      theme: 'light',
      locale: 'ru',
      practice: {
        fingerNumbers: true,
        namedNotes: true,
        melody: false,
        metronome: true,
        countIn: false,
        recording: false,
      },
      trainer: { autoNext: true },
      keyboard: {
        keySize: 'large',
        swipe: 'glissando',
        namedKeys: 'none',
        map: true,
        typing: true,
      },
    }
    expect(restored(saved, 6)).toEqual(saved)
  })

  it('gives a version-4 save named notes off, keeping its toggles', () => {
    const practice = {
      fingerNumbers: true,
      melody: true,
      metronome: false,
      countIn: true,
      recording: false,
    }
    expect(restored({ theme: 'dark', locale: 'en', practice }, 4).practice).toEqual({
      ...practice,
      namedNotes: false,
    })
  })

  it('gives a version-3 save the recording on, keeping its toggles', () => {
    const practice = { fingerNumbers: true, melody: true, metronome: false, countIn: true }
    expect(restored({ theme: 'dark', locale: 'en', practice }, 3).practice).toEqual({
      ...practice,
      namedNotes: false,
      recording: true,
    })
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
      quiz: { families: ['sev'], scales: ['major'] },
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

  it('gives a version-5 save auto-next off and no quiz choice, keeping the rest', () => {
    const settings = restored(
      {
        theme: 'dark',
        quiz: { families: ['tri'], scales: ['blues'] },
        practice: { countIn: true },
      },
      5,
    )
    expect(settings).not.toHaveProperty('quiz')
    expect(settings.trainer).toEqual(DEFAULT_TRAINER)
    expect(settings.theme).toBe('dark')
    expect(settings.practice.countIn).toBe(true)
  })

  it('turns an auto-next that is not a boolean off', () => {
    expect(restored({ trainer: { autoNext: 'yes' } }, 6).trainer).toEqual(DEFAULT_TRAINER)
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

  it('reads a save from a newer version for the fields it knows', () => {
    expect(restored({ theme: 'dark', locale: 'ru', future: true }, 6)).toEqual({
      theme: 'dark',
      locale: 'ru',
      ...DEFAULTS,
    })
  })

  it('follows a theme chosen in another tab', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createSettingsStore({ storage, languages: ['en'], otherTabs })
    writeSaved(storage, { ...store.getState(), theme: 'dark' }, 5)
    otherTabs.dispatchEvent(
      new StorageEvent('storage', {
        key: SETTINGS_STORAGE_KEY,
        newValue: storage.getItem(SETTINGS_STORAGE_KEY),
      }),
    )
    expect(store.getState().theme).toBe('dark')
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
