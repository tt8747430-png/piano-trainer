import { describe, expect, it } from 'vitest'
import { createSettingsStore, defaultKeyboard } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import {
  rememberChords,
  setAutoNext,
  setFloating,
  setChordFinder,
  setKeyboard,
  setLocale,
  setPracticeToggle,
  setMidi,
  setRecorderClick,
  setRecorderTune,
  setSectionFolded,
  setSidebar,
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

  it('setSectionFolded folds a section away once, and opens it again, saved', () => {
    const { storage, store } = setUp()
    setSectionFolded(store, 'chords.tensions', true)
    setSectionFolded(store, 'chords.tensions', true)
    setSectionFolded(store, 'progressions.between', true)
    expect(saved(storage).foldedSections).toEqual(['chords.tensions', 'progressions.between'])
    setSectionFolded(store, 'chords.tensions', false)
    expect(store.getState().foldedSections).toEqual(['progressions.between'])
  })

  it('setSidebar collapses the sidebar and saves it', () => {
    const { storage, store } = setUp()
    setSidebar(store, 'collapsed')
    expect(store.getState().sidebar).toBe('collapsed')
    expect(saved(storage).sidebar).toBe('collapsed')
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
      positions: false,
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
    expect(saved(storage).recorder).toEqual({ click: false, tune: false })
    setRecorderClick(store, true)
    expect(store.getState().recorder.click).toBe(true)
  })

  it('setRecorderTune saves whether the tune plays under a take, keeping the click', () => {
    const { storage, store } = setUp()
    setRecorderClick(store, false)
    setRecorderTune(store, true)
    expect(saved(storage).recorder).toEqual({ click: false, tune: true })
  })

  it('setMidi saves one MIDI setting and keeps the rest', () => {
    const { storage, store } = setUp()
    setMidi(store, { device: 'Piano' })
    setMidi(store, { touch: 'light' })
    expect(saved(storage).midi).toMatchObject({ device: 'Piano', touch: 'light', sound: false })
  })

  it('setFloating saves where the floating actions stand and keeps whether they say their names', () => {
    const { storage, store } = setUp()
    setFloating(store, { place: 'right' })
    expect(saved(storage).floating).toEqual({ place: 'right', labels: false })
    setFloating(store, { labels: true })
    expect(store.getState().floating).toEqual({ place: 'right', labels: true })
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
    setKeyboard(store, { swipe: 'glissando', namedKeys: 'all' })
    expect(store.getState().keyboard).toEqual({
      ...defaultKeyboard(false),
      swipe: 'glissando',
      namedKeys: 'all',
    })
    expect(saved(storage).keyboard).toEqual(store.getState().keyboard)
  })

  it('setChordFinder saves a switch; turned off, the Chord finder forgets its chords', () => {
    const { storage, store } = setUp()
    const C = [midi(60), midi(64), midi(67)]
    rememberChords(store, [C])
    expect(saved(storage).chordFinder.chords).toEqual([])
    setChordFinder(store, { remember: true })
    rememberChords(store, [C, C])
    expect(saved(storage).chordFinder).toEqual({
      remember: true,
      inKeys: true,
      slash: true,
      chords: [C, C],
    })
    setChordFinder(store, { inKeys: false })
    expect(store.getState().chordFinder.chords).toEqual([C, C])
    setChordFinder(store, { slash: false })
    expect(store.getState().chordFinder.slash).toBe(false)
    setChordFinder(store, { remember: false })
    expect(saved(storage).chordFinder).toEqual({
      remember: false,
      inKeys: false,
      slash: false,
      chords: [],
    })
  })
})
