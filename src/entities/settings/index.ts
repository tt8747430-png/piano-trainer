export {
  DEFAULT_TRAINER,
  PLAYING_TOGGLES,
  THEMES,
  defaultKeyboard,
  type KeyboardSettings,
  type PracticeToggle,
  type Theme,
  type TrainerSettings,
} from './model/types'
export { resolveTheme } from './model/resolve-theme'
export { createSettingsStore, SETTINGS_STORAGE_KEY, type SettingsStore } from './model/store'
export {
  selectKeyboard,
  selectLocale,
  selectPractice,
  selectTheme,
  selectTrainer,
} from './model/selectors'
export { SettingsStoreProvider, useSettings, useSettingsStoreApi } from './model/context'
