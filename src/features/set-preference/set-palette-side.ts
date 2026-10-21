import type { PaletteSide, SettingsStore } from '@/entities/settings'

/** Moves the score editor's palette to a side of the sheet, and saves it (ADR 0071). */
export function setPaletteSide(store: SettingsStore, paletteSide: PaletteSide): void {
  store.setState({ paletteSide })
}
