import type { IntervalSettings, SettingsStore } from '@/entities/settings'

/** Saves how Intervals plays them all and how fast (canvas 176), the choices not named kept. */
export function setIntervals(store: SettingsStore, change: Partial<IntervalSettings>): void {
  store.setState((state) => ({ intervals: { ...state.intervals, ...change } }))
}
