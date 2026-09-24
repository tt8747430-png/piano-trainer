import type { Locale, SettingsState, Theme } from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
