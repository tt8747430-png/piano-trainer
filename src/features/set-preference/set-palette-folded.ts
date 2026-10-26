import type { PalettePlace, SettingsStore } from '@/entities/settings'

/** Folds the score editor's palette to its bars where it stands, or opens it, and saves it there. */
export function setPaletteFolded(store: SettingsStore, place: PalettePlace, folded: boolean): void {
  store.setState((state) => ({ paletteFolded: { ...state.paletteFolded, [place]: folded } }))
}
