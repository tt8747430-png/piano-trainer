import type { ProgressionsSettings, SettingsStore } from '@/entities/settings'

/** Saves how every progression is written and voiced (A24), the choices not named kept. */
export function setProgressions(store: SettingsStore, change: Partial<ProgressionsSettings>): void {
  store.setState((state) => ({ progressions: { ...state.progressions, ...change } }))
}
