import type { SettingsStore } from '@/entities/settings'
import type { Locale } from '@/shared/i18n'

export function setLocale(store: SettingsStore, locale: Locale): void {
  store.setState({ locale })
}
