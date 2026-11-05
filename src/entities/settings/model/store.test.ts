// @vitest-environment jsdom
import { DEFAULT_BARS } from './bars'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createSettingsStore, SETTINGS_STORAGE_KEY, SETTINGS_VERSION } from './store'
import {
  DEFAULT_CHORD_FINDER,
  DEFAULT_SCORE_VIEW,
  DEFAULT_METRONOME,
  DEFAULT_MIDI,
  DEFAULT_PRACTICE,
  DEFAULT_EDITING,
  DEFAULT_RECORDER,
  DEFAULT_SIDEBAR,
  DEFAULT_OTHER_HAND,
  DEFAULT_PLAYBACK,
  DEFAULT_SOUND,
  DEFAULT_TRAINER,
  DEFAULT_PROGRESSIONS,
  DEFAULT_CHORD_PLAYER,
  defaultKeyboard,
  TEXT_SIZES,
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
  practice: DEFAULT_PRACTICE,
  sound: DEFAULT_SOUND,
  trainer: DEFAULT_TRAINER,
  keyboard: defaultKeyboard(false),
  recorder: DEFAULT_RECORDER,
  editing: DEFAULT_EDITING,
  sidebar: DEFAULT_SIDEBAR,
  paletteFolded: true,
  paletteList: false,
  paletteCategory: null,
  editorMode: 'replace',
  midi: DEFAULT_MIDI,
  chordFinder: DEFAULT_CHORD_FINDER,
  scoreView: DEFAULT_SCORE_VIEW,
  otherHand: DEFAULT_OTHER_HAND,
  playback: DEFAULT_PLAYBACK,
  metronome: DEFAULT_METRONOME,
  foldedSections: [],
  welcomed: false,
  tipsSeen: [],
  practiceRecent: [],
  lessonReading: 'page',
  progressions: DEFAULT_PROGRESSIONS,
  chordPlayer: DEFAULT_CHORD_PLAYER,
  bars: DEFAULT_BARS,
  tuner: { a4: 440 },
  scaleStaff: { degrees: true, steps: true, tonic: false, tetrachords: false },
}

describe('createSettingsStore', () => {
  it('reads a lesson as one page, or a section at a time where that was saved (round 26)', () => {
    expect(restored({}).lessonReading).toBe('page')
    expect(restored({ lessonReading: 'sections' }).lessonReading).toBe('sections')
    expect(restored({ lessonReading: 'scroll' }).lessonReading).toBe('page')
  })

  it('keeps how the Player plays where still valid, as it always did otherwise (B7)', () => {
    expect(
      restored({ playback: { countdown: 'loud', cursor: 'beats', pedal: 'down', speedStep: 3 } })
        .playback,
    ).toEqual({ ...DEFAULT_PLAYBACK, cursor: 'beats' })
  })

  it('keeps how the other hand looks and plays where still valid, dimmed and played otherwise (A35)', () => {
    expect(restored({ otherHand: { look: 'hide', play: false } }).otherHand).toEqual({
      look: 'hide',
      play: false,
    })
    expect(restored({ otherHand: { look: 'grey', play: 'yes' } }).otherHand).toEqual(
      DEFAULT_OTHER_HAND,
    )
    expect(restored({ melody: 'staff' })).not.toHaveProperty('melody')
  })

  it('starts on the system theme, the browser language, no toggles and no auto-next', () => {
    const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['ru-RU'] })
    expect(store.getState()).toEqual({ theme: 'system', locale: 'ru', ...DEFAULTS })
    expect(DEFAULT_PRACTICE).toEqual({
      fingerNumbers: false,
      namedNotes: false,
      positions: false,
      metronome: false,
    })
    expect(DEFAULT_TRAINER).toEqual({ autoNext: false })
    expect(DEFAULT_RECORDER).toEqual({ click: true, tune: false, countIn: 1 })
    expect(DEFAULT_MIDI).toEqual({
      input: true,
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
      locale: 'ru',
      practice: {
        fingerNumbers: true,
        namedNotes: true,
        positions: true,
        metronome: true,
      },
      playback: {
        countdown: 'visual',
        cursor: 'beats',
        pedal: 'automatic',
        speedStep: 10,
        follow: false,
        followReturn: 3,
      },
      otherHand: { look: 'show', play: false },
      sound: { staves: { bass: 35, staff0: 0 }, recording: 60, click: 5 },
      trainer: { autoNext: true },
      keyboard: {
        keySize: 'large',
        swipe: 'glissando',
        namedKeys: 'none',
        markNotes: false,
        chordNames: false,
        typing: true,
        autoplay: false,
        dock: 'top',
        folded: true,
        foldedLandscape: false,
        pedals: 'all',
        volume: 70,
      },
      recorder: { click: false, tune: true, countIn: 2 },
      editing: { hearNotes: false, paletteSide: 'right' },
      sidebar: 'collapsed',
      paletteFolded: false,
      paletteList: true,
      paletteCategory: 'clef',
      editorMode: 'insert',
      midi: {
        input: false,
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
        scale: true,
        chords: [
          [48, 52, 55],
          [53, 57, 60],
        ],
      },
      bars: { ...DEFAULT_BARS, 'select.songs': ['delete', 'move'] },
      tuner: { a4: 442 },
      scaleStaff: { degrees: false, steps: true, tonic: true, tetrachords: false },
      scoreView: {
        layout: 'vertical',
        music: 'grid',
        diagrams: 'summary',
        askOnOpen: true,
        chordNames: false,
        lyrics: false,
        pinned: false,
        textSize: 130,
        keys: false,
        annotations: false,
      },
      metronome: {
        bpm: 72,
        meter: '6/8',
        sound: 'drum',
        levels: ['downbeat', 'silent'],
        subdivision: 'triplets',
        trainer: { on: true, play: 4, mute: 1 },
        speed: { on: true, from: 60, to: 90, step: 3, every: 2 },
      },
      foldedSections: ['chords.tensions'],
      welcomed: true,
      tipsSeen: ['coach.listen'],
      practiceRecent: ['tuner', 'chords'],
      lessonReading: 'sections',
      progressions: { names: 'chords', voicing: 'block', inversion: 1 },
      chordPlayer: { names: 'nashville', voicing: 'block' },
    }
    expect(restored(saved)).toEqual(saved)
  })

  it('reads Progressions as numerals, voice-led from root position, each saved choice kept where valid (A24)', () => {
    expect(DEFAULT_PROGRESSIONS).toEqual({ names: 'numerals', voicing: 'led', inversion: 0 })
    expect(
      restored({ progressions: { names: 'nashville', voicing: 'block', inversion: 2 } })
        .progressions,
    ).toEqual({ names: 'nashville', voicing: 'block', inversion: 2 })
    expect(
      restored({ progressions: { names: 'roman', voicing: 'loose', inversion: 7 } }).progressions,
    ).toEqual(DEFAULT_PROGRESSIONS)
  })

  it('paints the key’s scale on the Chord finder’s keys only where that was saved (A24)', () => {
    expect(restored({ chordFinder: { scale: true } }).chordFinder.scale).toBe(true)
    expect(restored({ chordFinder: { scale: 'yes' } }).chordFinder.scale).toBe(false)
  })

  it('keeps each chord remembered that is still the keys of one, the newest at most', () => {
    const chords = [[60, 64, 67], 'C', [60, 'E'], [], [200, 60, 64], Array(11).fill(60)]
    expect(restored({ chordFinder: { remember: 'yes', chords } }).chordFinder).toEqual({
      remember: false,
      inKeys: true,
      slash: true,
      scale: false,
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

  it('keeps the Player’s view where still valid', () => {
    expect(
      restored({
        scoreView: {
          layout: 'page',
          music: 'chart',
          diagrams: 'carousel',
          askOnOpen: 'yes',
          chordNames: false,
          hidden: ['bass'],
        },
      }).scoreView,
    ).toEqual({
      layout: 'page',
      music: 'sheet',
      diagrams: 'animated',
      askOnOpen: false,
      chordNames: false,
      lyrics: true,
      pinned: true,
      textSize: 100,
      keys: true,
      annotations: true,
    })
    expect(restored({ scoreView: { layout: 'paper' } }).scoreView).toEqual(DEFAULT_SCORE_VIEW)
  })

  it('opens a sidebar saved as anything but open or collapsed', () => {
    expect(restored({ sidebar: 'wide' }).sidebar).toBe('open')
    expect(restored({ paletteFolded: false }).paletteFolded).toBe(false)
    expect(restored({ paletteFolded: { sheet: false } }).paletteFolded).toBe(true)
  })

  it('keeps the palette’s category by name, and none chosen where it is not a name (R31-E)', () => {
    expect(restored({ paletteCategory: 'clef' }).paletteCategory).toBe('clef')
    expect(restored({ paletteCategory: '' }).paletteCategory).toBeNull()
    expect(restored({ paletteCategory: ['clef'] }).paletteCategory).toBeNull()
  })

  it('hears notes as they are edited unless the learner saved otherwise (round 28)', () => {
    expect(DEFAULT_EDITING.hearNotes).toBe(true)
    expect(restored({ editing: { hearNotes: 'no' } }).editing).toEqual(DEFAULT_EDITING)
    expect(restored({ editing: { hearNotes: false } }).editing).toEqual({
      ...DEFAULT_EDITING,
      hearNotes: false,
    })
  })

  it('opens the editor in Replace, its palette at the left, unless left otherwise (R29 B7, R31-E)', () => {
    expect(DEFAULT_EDITING).toMatchObject({ paletteSide: 'left' })
    expect(restored({ editorMode: 'chord', editing: { paletteSide: 'top' } })).toMatchObject({
      editorMode: 'replace',
      editing: DEFAULT_EDITING,
    })
    expect(restored({ editorMode: 'insert', editing: { paletteSide: 'right' } })).toMatchObject({
      editorMode: 'insert',
      editing: { ...DEFAULT_EDITING, paletteSide: 'right' },
    })
  })

  it('turns a click that is not a boolean on, its default', () => {
    expect(restored({ recorder: { click: 'no' } }).recorder).toEqual(DEFAULT_RECORDER)
  })

  it('opens the Player in the sheet music, its view saved as any of the four (ADR 0108)', () => {
    expect(DEFAULT_SCORE_VIEW.music).toBe('sheet')
    for (const music of ['sheet', 'lyrics', 'diagrams', 'grid'])
      expect(restored({ scoreView: { music } }).scoreView.music).toBe(music)
  })

  it('opens Diagrams animated, and a song in the view saved, asking nothing (ADR 0108)', () => {
    expect(DEFAULT_SCORE_VIEW).toMatchObject({ diagrams: 'animated', askOnOpen: false })
    expect(restored({ scoreView: { diagrams: 'summary' } }).scoreView.diagrams).toBe('summary')
  })

  it('pins Chords over lyrics’ diagrams at its words’ own size, a size saved one of its steps (ADR 0108)', () => {
    expect(DEFAULT_SCORE_VIEW).toMatchObject({ pinned: true, textSize: 100 })
    expect(TEXT_SIZES).toContain(100)
    for (const textSize of TEXT_SIZES)
      expect(restored({ scoreView: { textSize } }).scoreView.textSize).toBe(textSize)
    for (const textSize of [99, '115', 0, null])
      expect(restored({ scoreView: { textSize } }).scoreView.textSize).toBe(100)
    expect(restored({ scoreView: { pinned: 'no' } }).scoreView.pinned).toBe(true)
  })

  it('keeps each bar as arranged where it reads within its limits (R29 B10)', () => {
    expect(
      restored({
        bars: {
          'select.songs': ['move', 'delete', 'tuner', 'move'],
          'swipe.songs.leading': [],
          nowhere: ['move'],
        },
      }).bars,
    ).toEqual({
      ...DEFAULT_BARS,
      'select.songs': ['move', 'delete'],
      'swipe.songs.leading': [],
    })
  })

  it('starts afresh over a save of the version before All keys (R34)', () => {
    expect(SETTINGS_VERSION).toBe(33)
    expect(restored({ theme: 'dark', editing: { hearNotes: false } }, 32)).toEqual(
      createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] }).getState(),
    )
  })

  it('keeps the Tuner’s A where it reads, 440 otherwise (R29 B11)', () => {
    expect(restored({ tuner: { a4: 432 } }).tuner).toEqual({ a4: 432 })
    expect(restored({ tuner: { a4: 500 } }).tuner).toEqual({ a4: 440 })
  })

  it('starts the Metronome at 120 in 4/4 with a click, each part saved kept where valid (A39)', () => {
    const trainer = { on: false, play: 2, mute: 2 }
    const speed = { on: false, from: 80, to: 120, step: 5, every: 4 }
    const plain = { levels: null, subdivision: 'none', trainer, speed }
    expect(DEFAULT_METRONOME).toEqual({ bpm: 120, meter: '4/4', sound: 'click', ...plain })
    // Any time signature it can count is kept; 4/3 is none.
    expect(restored({ metronome: { bpm: 400, meter: '7/8', sound: 'beep' } }).metronome).toEqual({
      bpm: 120,
      meter: '7/8',
      sound: 'beep',
      ...plain,
    })
    expect(restored({ metronome: { bpm: 66.5, meter: '4/3', sound: 'bell' } }).metronome).toEqual({
      bpm: 120,
      meter: '4/4',
      sound: 'click',
      ...plain,
    })
    expect(
      restored({ metronome: { trainer: { on: true, play: 3, mute: 9 } } }).metronome.trainer,
    ).toEqual({ on: true, play: 3, mute: 2 })
    // The squares as set are kept for a meter of as many beats, else the meter's own.
    const levels = ['downbeat', 'silent', 'accent']
    expect(restored({ metronome: { meter: '3/4', levels } }).metronome.levels).toEqual(levels)
    expect(restored({ metronome: { meter: '4/4', levels } }).metronome.levels).toBeNull()
    expect(
      restored({ metronome: { subdivision: 'triplets', speed: { on: true, step: 0 } } }).metronome,
    ).toMatchObject({ subdivision: 'triplets', speed: { on: true, step: 5 } })
    expect(restored({ metronome: 'fast' }).metronome).toEqual(DEFAULT_METRONOME)
  })

  it('plays every part at full volume until the learner turns one down (ADR 0105)', () => {
    expect(DEFAULT_SOUND).toEqual({ staves: {}, recording: 100, click: 100 })
  })

  it('keeps each volume saved as a whole percent from 0 to 100, at full otherwise', () => {
    expect(
      restored({
        sound: {
          staves: { treble: 0, bass: 101, staff2: 40, alto: 50, staff0: '40' },
          recording: -5,
          click: 52.5,
          extra: 3,
        },
      }).sound,
    ).toEqual({ staves: { treble: 0, staff2: 40 }, recording: 100, click: 100 })
    expect(restored({ sound: { rh: 40, staves: 'loud' } }).sound).toEqual(DEFAULT_SOUND)
    expect(restored({ sound: 'loud' }).sound).toEqual(DEFAULT_SOUND)
  })

  it('keeps no side for the palette: its panel stands at the sheet’s left (ADR 0114)', () => {
    expect(restored({ paletteSide: 'left' })).not.toHaveProperty('paletteSide')
  })

  it('plays from the computer keyboard by default only where the pointer is fine', () => {
    const keyboard = (finePointer: boolean) =>
      createSettingsStore({
        storage: createMemoryStorage(),
        languages: ['en'],
        finePointer,
      }).getState().keyboard
    expect(keyboard(true)).toEqual({
      keySize: 'piano',
      swipe: 'scroll',
      namedKeys: 'c',
      markNotes: true,
      chordNames: true,
      typing: true,
      autoplay: true,
      dock: 'bottom',
      folded: false,
      foldedLandscape: true,
      pedals: 'sustain',
      volume: 100,
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
      autoplay: 'no',
      dock: 'top',
      folded: true,
      foldedLandscape: 'no',
      pedals: 'three',
      volume: 140,
    }
    expect(restored({ theme: 'light', locale: 'en', keyboard }).keyboard).toEqual({
      keySize: 'piano',
      swipe: 'glissando',
      namedKeys: 'all',
      markNotes: true,
      chordNames: true,
      typing: false,
      autoplay: true,
      dock: 'top',
      folded: true,
      foldedLandscape: true,
      pedals: 'sustain',
      volume: 100,
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
    expect(restored({ practice: { metronome: 'yes', positions: true } }).practice).toEqual({
      ...DEFAULT_PRACTICE,
      positions: true,
    })
    expect(restored({ practice: { countIn: true } }).practice).not.toHaveProperty('countIn')
  })

  it('restores the MIDI keyboard’s settings, an unknown value taking its default alone', () => {
    const midi = {
      input: false,
      device: 'Piano',
      sound: true,
      throughPiano: true,
      octaveShift: -2,
      touch: 'heavy',
      pedal: 'reversed',
    }
    expect(restored({ midi }).midi).toEqual(midi)
    expect(
      restored({
        midi: { ...midi, input: 1, octaveShift: 3, touch: 'soft', device: '', sound: 'yes' },
      }).midi,
    ).toEqual({
      ...midi,
      input: true,
      octaveShift: 0,
      touch: 'normal',
      device: null,
      sound: false,
    })
    expect(restored({ midi: { device: 'x'.repeat(101) } }).midi.device).toBeNull()
  })

  it('turns an auto-next that is not a boolean off', () => {
    expect(restored({ trainer: { autoNext: 'yes' } }).trainer).toEqual(DEFAULT_TRAINER)
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
