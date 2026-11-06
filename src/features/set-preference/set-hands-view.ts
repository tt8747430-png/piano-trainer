import type { HandsViewSettings, SettingsStore } from '@/entities/settings'

/** Saves how the hands at the keys are drawn (R36): their skin's tone. */
export function setHandsView(store: SettingsStore, change: Partial<HandsViewSettings>): void {
  store.setState((state) => ({ handsView: { ...state.handsView, ...change } }))
}
