import type { SettingsStore } from '@/entities/settings'

/** Keeps the score editor's palette's category chosen, by name, and saves it (R31-E). */
export function setPaletteCategory(store: SettingsStore, category: string): void {
  store.setState({ paletteCategory: category })
}
