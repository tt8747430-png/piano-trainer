import { describe, expect, it } from 'vitest'
import { createSettingsStore, DEFAULT_QUIZ_CHOICE, defaultKeyboard } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import {
  setKeyboard,
  setLocale,
  setPracticeToggle,
  setQuizFamilies,
  setQuizScales,
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
      melody: false,
      metronome: true,
      countIn: false,
    })
    setPracticeToggle(store, 'metronome', false)
    expect(store.getState().practice.metronome).toBe(false)
  })

  it('setQuizFamilies saves the families in table order', () => {
    const { storage, store } = setUp()
    setQuizFamilies(store, ['nin', 'tri'])
    expect(saved(storage).quiz).toEqual({ ...DEFAULT_QUIZ_CHOICE, families: ['tri', 'nin'] })
  })

  it('setQuizFamilies keeps the choice when given none', () => {
    const { store } = setUp()
    setQuizFamilies(store, [])
    expect(store.getState().quiz).toEqual(DEFAULT_QUIZ_CHOICE)
  })

  it('setQuizScales saves the scales in table order, and keeps the choice when given none', () => {
    const { store } = setUp()
    setQuizScales(store, ['blues', 'major'])
    expect(store.getState().quiz.scales).toEqual(['major', 'blues'])
    setQuizScales(store, [])
    expect(store.getState().quiz.scales).toEqual(['major', 'blues'])
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
