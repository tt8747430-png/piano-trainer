import type { SettingsStore } from '@/entities/settings'

/** The welcome was seen: the app opens without it from now on. */
export function setWelcomed(store: SettingsStore): void {
  store.setState({ welcomed: true })
}
