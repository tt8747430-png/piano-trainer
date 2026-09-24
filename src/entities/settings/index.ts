export {
  detectLocale,
  isLocale,
  isTheme,
  LOCALES,
  THEMES,
  type Locale,
  type SettingsState,
  type Theme,
} from './model/types'
export {
  createSettingsStore,
  SETTINGS_STORAGE_KEY,
  SETTINGS_VERSION,
  type SettingsStore,
} from './model/store'
export { selectLocale, selectTheme } from './model/selectors'
export { SettingsStoreProvider, useSettings, useSettingsStoreApi } from './model/context'
