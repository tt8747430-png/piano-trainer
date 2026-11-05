import { describe, expect, it } from 'vitest'
import { DEFAULT_BARS } from './bars'
import {
  selectChordFinder,
  selectKeyboard,
  selectKeysHeight,
  selectOtherHand,
  selectMetronome,
  selectMidi,
  selectPractice,
  selectRecorder,
  selectSidebar,
  selectSound,
  selectTrainer,
  selectSectionFolded,
  selectPaletteFolded,
} from './selectors'
import {
  DEFAULT_CHORD_FINDER,
  DEFAULT_SCORE_VIEW,
  DEFAULT_METRONOME,
  DEFAULT_MIDI,
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_OTHER_HAND,
  DEFAULT_PLAYBACK,
  DEFAULT_SOUND,
  DEFAULT_EDITING,
  DEFAULT_TRAINER,
  DEFAULT_PROGRESSIONS,
  DEFAULT_CHORD_PLAYER,
  defaultKeyboard,
  type SettingsState,
} from './types'

describe('settings selectors', () => {
  it('return the practice toggles, the volumes, the trainer, keyboard, recorder and MIDI settings and the sidebar as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      sound: DEFAULT_SOUND,
      trainer: DEFAULT_TRAINER,
      keyboard: defaultKeyboard(false),
      keysHeight: { phone: 120, side: null, wide: null },
      recorder: DEFAULT_RECORDER,
      editing: DEFAULT_EDITING,
      foldedSections: ['chords.tensions'],
      welcomed: true,
      tipsSeen: [],
      practiceRecent: [],
      lessonReading: 'sections',
      sidebar: 'collapsed',
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
      progressions: DEFAULT_PROGRESSIONS,
      chordPlayer: DEFAULT_CHORD_PLAYER,
      bars: DEFAULT_BARS,
      tuner: { a4: 440 },
      scaleStaff: { degrees: true, steps: true, tonic: false, tetrachords: false },
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectSound(state)).toBe(DEFAULT_SOUND)
    expect(selectMetronome(state)).toBe(DEFAULT_METRONOME)
    expect(selectOtherHand(state)).toBe(DEFAULT_OTHER_HAND)
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectKeyboard(state)).toBe(state.keyboard)
    expect(selectKeysHeight(state)).toEqual({ phone: 120, side: null, wide: null })
    expect(selectRecorder(state)).toBe(DEFAULT_RECORDER)
    expect(selectSidebar(state)).toBe('collapsed')
    expect(selectMidi(state)).toBe(DEFAULT_MIDI)
    expect(selectChordFinder(state)).toBe(DEFAULT_CHORD_FINDER)
  })

  it('keeps the floating palette as the learner left it, folded or not (R31-E)', () => {
    const chosen = { paletteFolded: false } as unknown as SettingsState
    expect(selectPaletteFolded(chosen)).toBe(false)
  })

  it('says whether a section is folded away', () => {
    const state = { foldedSections: ['chords.tensions'] } as unknown as SettingsState
    expect(selectSectionFolded('chords.tensions')(state)).toBe(true)
    expect(selectSectionFolded('chords.practice')(state)).toBe(false)
  })
})
