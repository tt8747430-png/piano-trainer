import type { Locale } from '@/shared/i18n/locale'
import type {
  KeyboardSettings,
  PracticeToggles,
  SettingsState,
  Theme,
  TrainerSettings,
} from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
export const selectPractice = (state: SettingsState): PracticeToggles => state.practice
export const selectTrainer = (state: SettingsState): TrainerSettings => state.trainer
export const selectKeyboard = (state: SettingsState): KeyboardSettings => state.keyboard
