import type { SettingsStore, Theme } from '@/entities/settings'

export function setTheme(store: SettingsStore, theme: Theme): void {
  store.setState({ theme })
}
