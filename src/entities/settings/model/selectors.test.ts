import { describe, expect, it } from 'vitest'
import { selectKeyboard, selectPractice, selectQuizChoice } from './selectors'
import { DEFAULT_PRACTICE, DEFAULT_QUIZ_CHOICE, defaultKeyboard, type SettingsState } from './types'

describe('settings selectors', () => {
  it('return the practice toggles, the quiz choice and the keyboard settings as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      quiz: DEFAULT_QUIZ_CHOICE,
      keyboard: defaultKeyboard(false),
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectQuizChoice(state)).toBe(DEFAULT_QUIZ_CHOICE)
    expect(selectKeyboard(state)).toBe(state.keyboard)
  })
})
