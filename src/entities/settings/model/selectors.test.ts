import { describe, expect, it } from 'vitest'
import {
  selectChordFinder,
  selectKeyboard,
  selectMelody,
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
      welcomed: true,
      sidebar: 'collapsed',
      paletteFolded: {},
      paletteSections: null,
      midi: DEFAULT_MIDI,
      chordFinder: DEFAULT_CHORD_FINDER,
      scoreView: DEFAULT_SCORE_VIEW,
      melody: 'staff',
      metronome: DEFAULT_METRONOME,
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectSound(state)).toBe(DEFAULT_SOUND)
    expect(selectMetronome(state)).toBe(DEFAULT_METRONOME)
    expect(selectMelody(state)).toBe('staff')
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectFloating(state)).toEqual({ place: 'right', labels: true })
    expect(selectKeyboard(state)).toBe(state.keyboard)
    expect(selectRecorder(state)).toBe(DEFAULT_RECORDER)
    expect(selectSidebar(state)).toBe('collapsed')
    expect(selectMidi(state)).toBe(DEFAULT_MIDI)
    expect(selectChordFinder(state)).toBe(DEFAULT_CHORD_FINDER)
  })

  it('keeps the palette’s panel shown and its sheet compact, until the learner chooses', () => {
    const unset = { paletteFolded: {} } as unknown as SettingsState
    expect(selectPaletteFolded('sheet')(unset)).toBe(true)
    expect(selectPaletteFolded('panel')(unset)).toBe(false)
    const chosen = { paletteFolded: { panel: true, sheet: false } } as unknown as SettingsState
    expect(selectPaletteFolded('sheet')(chosen)).toBe(false)
    expect(selectPaletteFolded('panel')(chosen)).toBe(true)
  })

  it('says whether a section is folded away', () => {
    const state = { foldedSections: ['chords.tensions'] } as unknown as SettingsState
    expect(selectSectionFolded('chords.tensions')(state)).toBe(true)
    expect(selectSectionFolded('chords.practice')(state)).toBe(false)
  })
})
