import { describe, expect, it } from 'vitest'
import {
  selectKeyboard,
  selectMidi,
  selectPractice,
  selectRecorder,
  selectSidebar,
  selectTrainer,
} from './selectors'
import {
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
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      trainer: DEFAULT_TRAINER,
      keyboard: defaultKeyboard(false),
      recorder: DEFAULT_RECORDER,
      sidebar: 'collapsed',
      midi: DEFAULT_MIDI,
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectKeyboard(state)).toBe(state.keyboard)
    expect(selectRecorder(state)).toBe(DEFAULT_RECORDER)
    expect(selectSidebar(state)).toBe('collapsed')
    expect(selectMidi(state)).toBe(DEFAULT_MIDI)
  })
})
