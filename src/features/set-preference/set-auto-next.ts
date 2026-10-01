import type { SettingsStore } from '@/entities/settings'

/** Saves whether a trainer moves on by itself after a right answer. */
export function setAutoNext(store: SettingsStore, on: boolean): void {
  store.setState((state) => ({ trainer: { ...state.trainer, autoNext: on } }))
}
