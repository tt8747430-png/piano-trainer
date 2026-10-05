import { describe, expect, it } from 'vitest'
import {
  selectKeyboard,
  selectPractice,
  selectRecorder,
  selectSidebar,
  selectTrainer,
} from './selectors'
import {
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_TRAINER,
  defaultKeyboard,
  type SettingsState,
} from './types'

describe('settings selectors', () => {
  it('return the practice toggles, the trainer, keyboard and recorder settings and the sidebar as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      trainer: DEFAULT_TRAINER,
      keyboard: defaultKeyboard(false),
      recorder: DEFAULT_RECORDER,
      sidebar: 'collapsed',
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectKeyboard(state)).toBe(state.keyboard)
    expect(selectRecorder(state)).toBe(DEFAULT_RECORDER)
    expect(selectSidebar(state)).toBe('collapsed')
  })
})
