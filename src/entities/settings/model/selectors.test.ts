import { describe, expect, it } from 'vitest'
import {
  selectChordFinder,
  selectKeyboard,
  selectMetronome,
  selectMidi,
  selectPractice,
  selectRecorder,
  selectSidebar,
  selectSound,
  selectTrainer,
  selectFloating,
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
  DEFAULT_SOUND,
  DEFAULT_TRAINER,
  defaultKeyboard,
  type SettingsState,
} from './types'

describe('settings selectors', () => {
  it('return the practice toggles, the volumes, the trainer, keyboard, recorder and MIDI settings and the sidebar as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      titles: 'small',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      sound: DEFAULT_SOUND,
      trainer: DEFAULT_TRAINER,
      floating: { place: 'right', labels: true },
      keyboard: defaultKeyboard(false),
      recorder: DEFAULT_RECORDER,
      foldedSections: ['chords.tensions'],
      sidebar: 'collapsed',
      paletteFolded: {},
      midi: DEFAULT_MIDI,
      chordFinder: DEFAULT_CHORD_FINDER,
      scoreView: DEFAULT_SCORE_VIEW,
      metronome: DEFAULT_METRONOME,
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectSound(state)).toBe(DEFAULT_SOUND)
    expect(selectMetronome(state)).toBe(DEFAULT_METRONOME)
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectFloating(state)).toEqual({ place: 'right', labels: true })
    expect(selectKeyboard(state)).toBe(state.keyboard)
    expect(selectRecorder(state)).toBe(DEFAULT_RECORDER)
    expect(selectSidebar(state)).toBe('collapsed')
    expect(selectMidi(state)).toBe(DEFAULT_MIDI)
    expect(selectChordFinder(state)).toBe(DEFAULT_CHORD_FINDER)
  })

  it('folds the palette at the foot and opens it beside the sheet, until the learner chooses', () => {
    const unset = { paletteFolded: {} } as unknown as SettingsState
    expect(selectPaletteFolded('foot')(unset)).toBe(true)
    expect(selectPaletteFolded('beside')(unset)).toBe(false)
    const chosen = { paletteFolded: { beside: true, foot: false } } as unknown as SettingsState
    expect(selectPaletteFolded('foot')(chosen)).toBe(false)
    expect(selectPaletteFolded('beside')(chosen)).toBe(true)
  })

  it('says whether a section is folded away', () => {
    const state = { foldedSections: ['chords.tensions'] } as unknown as SettingsState
    expect(selectSectionFolded('chords.tensions')(state)).toBe(true)
    expect(selectSectionFolded('chords.practice')(state)).toBe(false)
  })
})
