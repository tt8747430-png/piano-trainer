import type { SettingsStore } from '@/entities/settings'

/** Keeps the score editor's panel's open sections, by name, and saves them. */
export function setPaletteSections(store: SettingsStore, sections: readonly string[]): void {
  store.setState({ paletteSections: sections })
}
