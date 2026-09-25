import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createSettingsStore, SettingsStoreProvider, type Theme } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import type { Locale } from '@/shared/i18n'
import { createMemoryStorage } from '@/shared/lib'

/** `ui` under a fresh in-memory settings store, in the given language and theme. */
export function renderWithSettings(
  ui: ReactElement,
  { locale = 'en', theme = 'system' }: { locale?: Locale; theme?: Theme } = {},
) {
  const settingsStore = createSettingsStore({ storage: createMemoryStorage(), languages: [locale] })
  setTheme(settingsStore, theme)
  const view = render(<SettingsStoreProvider store={settingsStore}>{ui}</SettingsStoreProvider>)
  return { ...view, settingsStore }
}
