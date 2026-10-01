import { describe, expect, it } from 'vitest'
import { selectKeyboard, selectPractice, selectTrainer } from './selectors'
import { DEFAULT_PRACTICE, DEFAULT_TRAINER, defaultKeyboard, type SettingsState } from './types'

describe('settings selectors', () => {
  it('return the practice toggles, the trainer settings and the keyboard settings as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      trainer: DEFAULT_TRAINER,
      keyboard: defaultKeyboard(false),
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectTrainer(state)).toBe(DEFAULT_TRAINER)
    expect(selectKeyboard(state)).toBe(state.keyboard)
  })
})
