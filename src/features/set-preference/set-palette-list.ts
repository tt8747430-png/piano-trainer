import type { SettingsStore } from '@/entities/settings'

/** Shows the score editor's palette as named rows (Flat's list view) or as cells, and saves it. */
export function setPaletteList(store: SettingsStore, list: boolean): void {
  store.setState({ paletteList: list })
}
