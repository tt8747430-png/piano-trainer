import type { ScaleStaffSettings, SettingsStore } from '@/entities/settings'

/** Saves which theory the Scales page writes on its staff (A43). */
export function setScaleStaff(store: SettingsStore, change: Partial<ScaleStaffSettings>): void {
  store.setState((state) => ({ scaleStaff: { ...state.scaleStaff, ...change } }))
}
