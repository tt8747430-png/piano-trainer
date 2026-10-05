import type { SettingsStore } from '@/entities/settings'

/** Saves whether the click goes on after the count-in while a take records. */
export function setRecorderClick(store: SettingsStore, on: boolean): void {
  store.setState((state) => ({ recorder: { ...state.recorder, click: on } }))
}
