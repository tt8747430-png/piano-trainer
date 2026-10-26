import type { SettingsStore, SoundSettings } from '@/entities/settings'

/** Saves how loud a part of the Player's music sounds (ADR 0105), keeping the rest. */
export function setSound(store: SettingsStore, change: Partial<SoundSettings>): void {
  store.setState((state) => ({ sound: { ...state.sound, ...change } }))
}

/**
 * Chordify's tip, "turn the Song volume down and the chord volume up to only hear the chords": the
 * recording silent, both hands at full; the staves and the click as they were.
 */
export function onlyTheChords(store: SettingsStore): void {
  setSound(store, { recording: 0, rh: 100, lh: 100 })
}
