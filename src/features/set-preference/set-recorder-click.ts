import type { RecorderCountIn, SettingsStore } from '@/entities/settings'

/** Saves whether the click goes on after the count-in while a take records. */
export function setRecorderClick(store: SettingsStore, on: boolean): void {
  store.setState((state) => ({ recorder: { ...state.recorder, click: on } }))
}

/** Saves how many bars a take counts in (A40, Start countdown): none starts it on the first note. */
export function setRecorderCountIn(store: SettingsStore, countIn: RecorderCountIn): void {
  store.setState((state) => ({ recorder: { ...state.recorder, countIn } }))
}
