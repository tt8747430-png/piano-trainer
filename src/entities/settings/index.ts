export {
  PLAYING_TOGGLES,
  FOLDED_MAX,
  REMEMBERED_CHORDS,
  THEMES,
  TITLE_SIZES,
  defaultKeyboard,
  type ChordFinderSettings,
  type KeyboardSettings,
  type MidiSettings,
  type PracticeToggle,
  type Sidebar,
  type Theme,
  type TitleSize,
} from './model/types'
export { resolveTheme } from './model/resolve-theme'
export {
  createSettingsStore,
  SETTINGS_STORAGE_KEY,
  SETTINGS_VERSION,
  type SettingsStore,
} from './model/store'
export {
  selectChordFinder,
  selectKeyboard,
  selectLocale,
  selectMidi,
  selectPractice,
  selectRecorder,
  selectSectionFolded,
  selectSidebar,
  selectTheme,
  selectTitles,
  selectTrainer,
} from './model/selectors'
export { SettingsStoreProvider, useSettings, useSettingsStoreApi } from './model/context'
