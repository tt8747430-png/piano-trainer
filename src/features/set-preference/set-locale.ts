import type { Locale, SettingsStore } from '@/entities/settings'

export function setLocale(store: SettingsStore, locale: Locale): void {
  store.setState({ locale })
}
