import { describe, expect, it } from 'vitest'
import {
  selectChordFinder,
  selectKeyboard,
  selectMidi,
  selectPractice,
  selectRecorder,
  selectSidebar,
  selectTrainer,
  selectFloating,
  selectSectionFolded,
} from './selectors'
import {
  DEFAULT_CHORD_FINDER,
  DEFAULT_SCORE_VIEW,
  DEFAULT_MIDI,
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_TRAINER,
  defaultKeyboard,
  type SettingsState,
} from './types'

describe('settings selectors', () => {
  it('return the practice toggles, the trainer, keyboard, recorder and MIDI settings and the sidebar as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      titles: 'small',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      trainer: DEFAULT_TRAINER,
      floating: { place: 'right', labels: true },
      keyboard: defaultKeyboard(false),
      recorder: DEFAULT_RECORDER,
      foldedSections: ['chords.tensions'],
      sidebar: 'collapsed',
      paletteSide: 'right',
      paletteFolded: false,
      midi: DEFAULT_MIDI,
      chordFinder: DEFAULT_CHORD_FINDER,
      scoreView: DEFAULT_SCORE_VIEW,
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectFloating(state)).toEqual({ place: 'right', labels: true })
    expect(selectKeyboard(state)).toBe(state.keyboard)
    expect(selectRecorder(state)).toBe(DEFAULT_RECORDER)
    expect(selectSidebar(state)).toBe('collapsed')
    expect(selectMidi(state)).toBe(DEFAULT_MIDI)
    expect(selectChordFinder(state)).toBe(DEFAULT_CHORD_FINDER)
  })

  it('says whether a section is folded away', () => {
    const state = { foldedSections: ['chords.tensions'] } as unknown as SettingsState
    expect(selectSectionFolded('chords.tensions')(state)).toBe(true)
    expect(selectSectionFolded('chords.practice')(state)).toBe(false)
  })
})
