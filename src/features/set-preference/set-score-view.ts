import type { ScoreViewSettings, SettingsStore } from '@/entities/settings'

/** Saves how the Player shows a score: its layout and switches. */
export function setScoreView(store: SettingsStore, change: Partial<ScoreViewSettings>): void {
  store.setState((state) => ({ scoreView: { ...state.scoreView, ...change } }))
}
