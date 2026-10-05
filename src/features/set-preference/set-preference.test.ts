import { describe, expect, it } from 'vitest'
import { createSettingsStore, defaultKeyboard } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import {
  setAutoNext,
  setKeyboard,
  setLocale,
  setPracticeToggle,
  setRecorderClick,
  setTheme,
} from './index'

const saved = (storage: Storage) => JSON.parse(storage.getItem('pt-settings') ?? 'null').state

function setUp() {
  const storage = createMemoryStorage()
  return { storage, store: createSettingsStore({ storage, languages: ['en'] }) }
}

describe('set-preference', () => {
  it('setTheme changes and saves the theme', () => {
    const { storage, store } = setUp()
    setTheme(store, 'dark')
    expect(store.getState().theme).toBe('dark')
    expect(saved(storage).theme).toBe('dark')
  })

  it('setLocale changes and saves the language', () => {
    const { storage, store } = setUp()
    setLocale(store, 'ru')
    expect(store.getState().locale).toBe('ru')
    expect(saved(storage).locale).toBe('ru')
  })

  it('setPracticeToggle turns one toggle on and saves it, leaving the others', () => {
    const { storage, store } = setUp()
    setPracticeToggle(store, 'metronome', true)
    expect(saved(storage).practice).toEqual({
      fingerNumbers: false,
      namedNotes: false,
      melody: false,
      metronome: true,
      countIn: false,
      recording: true,
    })
    setPracticeToggle(store, 'metronome', false)
    expect(store.getState().practice.metronome).toBe(false)
  })

  it('setRecorderClick saves whether the click goes on while a take records', () => {
    const { storage, store } = setUp()
    setRecorderClick(store, false)
    expect(saved(storage).recorder).toEqual({ click: false })
    setRecorderClick(store, true)
    expect(store.getState().recorder.click).toBe(true)
  })

  it('setAutoNext saves whether a trainer moves on by itself', () => {
    const { storage, store } = setUp()
    setAutoNext(store, true)
    expect(saved(storage).trainer).toEqual({ autoNext: true })
    setAutoNext(store, false)
    expect(store.getState().trainer.autoNext).toBe(false)
  })

  it('setKeyboard changes the keyboard settings it is given and saves them, the others kept', () => {
    const { storage, store } = setUp()
    setKeyboard(store, { swipe: 'glissando', map: true })
    expect(store.getState().keyboard).toEqual({
      ...defaultKeyboard(false),
      swipe: 'glissando',
      map: true,
    })
    expect(saved(storage).keyboard).toEqual(store.getState().keyboard)
  })
})
