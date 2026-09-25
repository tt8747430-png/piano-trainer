import { describe, expect, it } from 'vitest'
import { selectPractice, selectQuizChoice } from './selectors'
import { DEFAULT_PRACTICE, DEFAULT_QUIZ_CHOICE, type SettingsState } from './types'

describe('settings selectors', () => {
  it('return the practice toggles and the quiz choice as saved', () => {
    const state: SettingsState = {
      theme: 'system',
      locale: 'en',
      practice: DEFAULT_PRACTICE,
      quiz: DEFAULT_QUIZ_CHOICE,
    }
    expect(selectPractice(state)).toBe(DEFAULT_PRACTICE)
    expect(selectQuizChoice(state)).toBe(DEFAULT_QUIZ_CHOICE)
  })
})
