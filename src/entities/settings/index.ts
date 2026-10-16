export {
  PLAYING_TOGGLES,
  FOLDED_MAX,
  REMEMBERED_CHORDS,
  THEMES,
  TITLE_SIZES,
  defaultKeyboard,
  FLOATING_PLACES,
  type ChordFinderSettings,
  type FloatingPlace,
  type FloatingSettings,
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
  selectFloating,
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
