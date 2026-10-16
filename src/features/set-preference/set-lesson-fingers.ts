import type { SettingsStore } from '@/entities/settings'

/** Saves whether a lesson's scales carry the fingers that play them. */
export function setLessonFingers(store: SettingsStore, on: boolean): void {
  store.setState((state) => ({ lesson: { ...state.lesson, fingers: on } }))
}
