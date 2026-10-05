import type { SettingsStore, Sidebar } from '@/entities/settings'

/** Opens or collapses a laptop's sidebar, and saves it. */
export function setSidebar(store: SettingsStore, sidebar: Sidebar): void {
  store.setState({ sidebar })
}
