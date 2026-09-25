import type { Locale } from '@/shared/i18n/locale'
import type { PracticeToggles, QuizChoice, SettingsState, Theme } from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
export const selectPractice = (state: SettingsState): PracticeToggles => state.practice
export const selectQuizChoice = (state: SettingsState): QuizChoice => state.quiz
