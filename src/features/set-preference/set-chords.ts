import type { ChordsSettings, SettingsStore } from '@/entities/settings'

/** Saves the Chords page's own settings, the choices not named kept. */
export function setChords(store: SettingsStore, change: Partial<ChordsSettings>): void {
  store.setState((state) => ({ chords: { ...state.chords, ...change } }))
}
