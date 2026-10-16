import type { SettingsStore, TitleSize } from '@/entities/settings'

/** Saves how large every screen's title is. */
export function setTitles(store: SettingsStore, titles: TitleSize): void {
  store.setState({ titles })
}
