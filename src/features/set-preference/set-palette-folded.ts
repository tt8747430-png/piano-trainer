import type { PalettePlace, SettingsStore } from '@/entities/settings'

/** Hides the score editor's panel or shows it, or folds its sheet to its quick row or expands it, and saves it. */
export function setPaletteFolded(store: SettingsStore, place: PalettePlace, folded: boolean): void {
  store.setState((state) => ({ paletteFolded: { ...state.paletteFolded, [place]: folded } }))
}
