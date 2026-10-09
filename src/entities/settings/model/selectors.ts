import type { Locale } from '@/shared/i18n/locale'
import type {
  KeyboardSettings,
  MidiSettings,
  PracticeToggles,
  RecorderSettings,
  SettingsState,
  Sidebar,
  Theme,
  TrainerSettings,
} from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
export const selectPractice = (state: SettingsState): PracticeToggles => state.practice
export const selectTrainer = (state: SettingsState): TrainerSettings => state.trainer
export const selectKeyboard = (state: SettingsState): KeyboardSettings => state.keyboard
export const selectRecorder = (state: SettingsState): RecorderSettings => state.recorder
export const selectSidebar = (state: SettingsState): Sidebar => state.sidebar
export const selectMidi = (state: SettingsState): MidiSettings => state.midi
