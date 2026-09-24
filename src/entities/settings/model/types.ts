export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export const LOCALES = ['en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

export interface SettingsState {
  theme: Theme
  locale: Locale
}

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme)
export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
