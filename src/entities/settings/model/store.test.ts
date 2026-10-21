// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createSettingsStore, SETTINGS_STORAGE_KEY, SETTINGS_VERSION } from './store'
import {
  DEFAULT_CHORD_FINDER,
  DEFAULT_SCORE_VIEW,
  DEFAULT_MIDI,
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_SIDEBAR,
  DEFAULT_TRAINER,
  DEFAULT_FLOATING,
  defaultKeyboard,
} from './types'

/** Puts settings in storage as an earlier session would have saved them. */
const writeSaved = (storage: Storage, state: unknown, version = SETTINGS_VERSION) =>
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ state, version }))

const restored = (state: unknown, version = SETTINGS_VERSION) => {
  const storage = createMemoryStorage()
  writeSaved(storage, state, version)
  return createSettingsStore({ storage, languages: ['en'] }).getState()
}

// The test setup's matchMedia answers false: no fine pointer, so no typing by default.
const DEFAULTS = {
  titles: 'large',
  practice: DEFAULT_PRACTICE,
  trainer: DEFAULT_TRAINER,
  floating: DEFAULT_FLOATING,
  keyboard: defaultKeyboard(false),
  recorder: DEFAULT_RECORDER,
  sidebar: DEFAULT_SIDEBAR,
  paletteSide: 'right',
  midi: DEFAULT_MIDI,
  chordFinder: DEFAULT_CHORD_FINDER,
  scoreView: DEFAULT_SCORE_VIEW,
  foldedSections: [],
}

describe('createSettingsStore', () => {
  it('starts on the system theme, the browser language, no toggles and no auto-next', () => {
    const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['ru-RU'] })
    expect(store.getState()).toEqual({ theme: 'system', locale: 'ru', ...DEFAULTS })
    expect(DEFAULT_PRACTICE).toEqual({
      fingerNumbers: false,
      namedNotes: false,
      positions: false,
      melody: false,
      metronome: false,
      countIn: false,
      recording: true,
    })
    expect(DEFAULT_TRAINER).toEqual({ autoNext: false })
    expect(DEFAULT_RECORDER).toEqual({ click: true, tune: false })
    expect(DEFAULT_MIDI).toEqual({
      device: null,
      sound: false,
      throughPiano: false,
      octaveShift: 0,
      touch: 'normal',
      pedal: 'normal',
    })
  })

  it('saves under pt-settings with its version', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    store.setState({ theme: 'dark' })
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual({
      state: { theme: 'dark', locale: 'en', ...DEFAULTS },
      version: SETTINGS_VERSION,
    })
  })

  it('restores what was saved', () => {
    const saved = {
      theme: 'light',
      titles: 'small',
      locale: 'ru',
      practice: {
        fingerNumbers: true,
        namedNotes: true,
        positions: true,
        melody: false,
        metronome: true,
        countIn: false,
        recording: false,
      },
      trainer: { autoNext: true },
      floating: { place: 'right', labels: true },
      keyboard: {
        keySize: 'large',
        swipe: 'glissando',
        namedKeys: 'none',
        markNotes: false,
        chordNames: false,
        typing: true,
        dock: 'top',
        folded: true,
        foldedLandscape: false,
        keyLength: 'short',
        railControls: ['zoom', 'pedal'],
      },
      recorder: { click: false, tune: true },
      sidebar: 'collapsed',
      paletteSide: 'right',
      midi: {
        device: 'Piano',
        sound: true,
        throughPiano: false,
        octaveShift: 1,
        touch: 'light',
        pedal: 'normal',
      },
      chordFinder: {
        remember: true,
        inKeys: false,
        slash: false,
        chords: [
          [48, 52, 55],
          [53, 57, 60],
        ],
      },
      scoreView: {
        layout: 'scroll',
        notation: true,
        chordNames: false,
        melodyStaff: false,
        hidden: ['treble'],
        keys: false,
      },
      foldedSections: ['chords.tensions'],
    }
    expect(restored(saved)).toEqual(saved)
  })

  it('keeps each chord remembered that is still the keys of one, the newest at most', () => {
    const chords = [[60, 64, 67], 'C', [60, 'E'], [], [200, 60, 64], Array(11).fill(60)]
    expect(restored({ chordFinder: { remember: 'yes', chords } }).chordFinder).toEqual({
      remember: false,
      inKeys: true,
      slash: true,
      chords: [
        [60, 64, 67],
        [60, 64],
      ],
    })
    const many = Array.from({ length: 30 }, (_, i) => [40 + i])
    const kept = restored({ chordFinder: { chords: many } }).chordFinder.chords
    expect(kept).toHaveLength(24)
    expect(kept.at(-1)).toEqual([69])
  })

  it('keeps the Player’s view where still valid, each staff hidden once', () => {
    expect(
      restored({
        scoreView: {
          layout: 'pages',
          notation: 'no',
          chordNames: false,
          hidden: ['bass', 'x', 'bass'],
        },
      }).scoreView,
    ).toEqual({
      layout: 'pages',
      notation: true,
      chordNames: false,
      melodyStaff: true,
      hidden: ['bass'],
      keys: true,
    })
    expect(restored({ scoreView: { layout: 'paper' } }).scoreView).toEqual(DEFAULT_SCORE_VIEW)
  })

  it('opens a sidebar saved as anything but open or collapsed', () => {
    expect(restored({ sidebar: 'wide' }).sidebar).toBe('open')
    expect(restored({ paletteSide: 'top' }).paletteSide).toBe('right')
    expect(restored({ paletteSide: 'left' }).paletteSide).toBe('left')
  })

  it('turns a click that is not a boolean on, its default', () => {
    expect(restored({ recorder: { click: 'no' } }).recorder).toEqual(DEFAULT_RECORDER)
  })

  it('starts afresh over a save of the version before, which had no fold for a phone on its side', () => {
    expect(SETTINGS_VERSION).toBe(3)
    expect(restored({ theme: 'dark', keyboard: { folded: true } }, 2)).toEqual(
      createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] }).getState(),
    )
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
      markNotes: true,
      chordNames: true,
      typing: true,
      dock: 'bottom',
      folded: false,
      foldedLandscape: true,
      keyLength: 'long',
      railControls: [
        'zoom',
        'noteNames',
        'chordNames',
        'typing',
        'midiSound',
        'glissando',
        'pedal',
      ],
    })
    expect(keyboard(false).typing).toBe(false)
  })

  it('restores the keyboard settings, an unknown value taking its default alone', () => {
    const keyboard = {
      keySize: 'huge',
      swipe: 'glissando',
      namedKeys: 'all',
      markNotes: 'no',
      chordNames: 'no',
      typing: 'yes',
      dock: 'top',
      folded: true,
      foldedLandscape: 'no',
      keyLength: 'tiny',
      railControls: ['pedal', 'pedal', 'nope'],
    }
    expect(restored({ theme: 'light', locale: 'en', keyboard }).keyboard).toEqual({
      keySize: 'fit',
      swipe: 'glissando',
      namedKeys: 'all',
      markNotes: true,
      chordNames: true,
      typing: false,
      dock: 'top',
      folded: true,
      foldedLandscape: true,
      keyLength: 'long',
      railControls: ['pedal'],
    })
  })

  it('keeps each section folded once, an id a section could have, the newest at most', () => {
    const ids = [
      'chords.tensions',
      7,
      '',
      'x'.repeat(65),
      'chords.tensions',
      'progressions.between',
    ]
    expect(restored({ foldedSections: ids }).foldedSections).toEqual([
      'chords.tensions',
      'progressions.between',
    ])
    const many = Array.from({ length: 120 }, (_, i) => `s${i}`)
    expect(restored({ foldedSections: many }).foldedSections).toHaveLength(100)
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

  it('restores the MIDI keyboard’s settings, an unknown value taking its default alone', () => {
    const midi = {
      device: 'Piano',
      sound: true,
      throughPiano: true,
      octaveShift: -2,
      touch: 'heavy',
      pedal: 'reversed',
    }
    expect(restored({ midi }).midi).toEqual(midi)
    expect(
      restored({ midi: { ...midi, octaveShift: 3, touch: 'soft', device: '', sound: 'yes' } }).midi,
    ).toEqual({ ...midi, octaveShift: 0, touch: 'normal', device: null, sound: false })
    expect(restored({ midi: { device: 'x'.repeat(101) } }).midi.device).toBeNull()
  })

  it('turns an auto-next that is not a boolean off', () => {
    expect(restored({ trainer: { autoNext: 'yes' } }).trainer).toEqual(DEFAULT_TRAINER)
  })

  it('keeps the floating actions where saved, in the middle and wordless where not valid', () => {
    expect(restored({ floating: { place: 'top', labels: 'yes' } }).floating).toEqual({
      place: 'center',
      labels: false,
    })
    expect(restored({ floating: { place: 'left', labels: true } }).floating).toEqual({
      place: 'left',
      labels: true,
    })
  })

  it('gives a setting never saved its default, keeping the rest', () => {
    expect(restored({ theme: 'dark', locale: 'ru', future: true })).toEqual({
      theme: 'dark',
      locale: 'ru',
      ...DEFAULTS,
    })
  })

  it('does not read a save of another version', () => {
    expect(restored({ theme: 'dark', locale: 'ru' }, SETTINGS_VERSION + 1)).toEqual({
      theme: 'system',
      locale: 'en',
      ...DEFAULTS,
    })
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

  it('follows a theme chosen in another tab', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createSettingsStore({ storage, languages: ['en'], otherTabs })
    writeSaved(storage, { ...store.getState(), theme: 'dark' })
    otherTabs.dispatchEvent(
      new StorageEvent('storage', {
        key: SETTINGS_STORAGE_KEY,
        newValue: storage.getItem(SETTINGS_STORAGE_KEY),
      }),
    )
    expect(store.getState().theme).toBe('dark')
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
