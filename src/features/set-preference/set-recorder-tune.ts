import type { SettingsStore } from '@/entities/settings'

/** Saves whether the song's tune plays under a take while it records. */
export function setRecorderTune(store: SettingsStore, on: boolean): void {
  store.setState((state) => ({ recorder: { ...state.recorder, tune: on } }))
}
