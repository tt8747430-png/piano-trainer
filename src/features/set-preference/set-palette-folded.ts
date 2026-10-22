import type { SettingsStore } from '@/entities/settings'

/** Folds the score editor's palette into its button, or opens it, and saves it. */
export function setPaletteFolded(store: SettingsStore, paletteFolded: boolean): void {
  store.setState({ paletteFolded })
}
