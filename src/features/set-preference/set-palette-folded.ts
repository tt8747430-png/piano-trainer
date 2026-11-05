import type { SettingsStore } from '@/entities/settings'

/** Hides the score editor's panel or shows it, or folds its sheet to its quick row or expands it, and saves it. */
export function setPaletteFolded(store: SettingsStore, folded: boolean): void {
  store.setState({ paletteFolded: folded })
}
