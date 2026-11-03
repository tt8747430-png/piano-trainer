import type { OtherHandSettings, SettingsStore } from '@/entities/settings'

/** Saves how the other hand looks or whether it is heard while one hand is practised (A35). */
export function setOtherHand(store: SettingsStore, change: Partial<OtherHandSettings>): void {
  store.setState((state) => ({ otherHand: { ...state.otherHand, ...change } }))
}
