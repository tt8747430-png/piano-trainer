import type { ChordPlayerSettings, SettingsStore } from '@/entities/settings'

/** Saves how the Chord player writes its chords and voices its piano (R29 CP6), the choices not named kept. */
export function setChordPlayer(store: SettingsStore, change: Partial<ChordPlayerSettings>): void {
  store.setState((state) => ({ chordPlayer: { ...state.chordPlayer, ...change } }))
}
