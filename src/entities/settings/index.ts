export {
  PLAYING_TOGGLES,
  THEMES,
  defaultKeyboard,
  type KeyboardSettings,
  type MidiSettings,
  type PracticeToggle,
  type Sidebar,
  type Theme,
} from './model/types'
export { resolveTheme } from './model/resolve-theme'
export { createSettingsStore, SETTINGS_STORAGE_KEY, type SettingsStore } from './model/store'
export {
  selectKeyboard,
  selectLocale,
  selectMidi,
  selectPractice,
  selectRecorder,
  selectSidebar,
  selectTheme,
  selectTrainer,
} from './model/selectors'
export { SettingsStoreProvider, useSettings, useSettingsStoreApi } from './model/context'
