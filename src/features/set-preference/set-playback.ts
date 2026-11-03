import type { PlaybackSettings, SettingsStore } from '@/entities/settings'

/** Saves how the Player always plays: its count-in, cursor, pedal or speed training's step (B7). */
export function setPlayback(store: SettingsStore, change: Partial<PlaybackSettings>): void {
  store.setState((state) => ({ playback: { ...state.playback, ...change } }))
}
