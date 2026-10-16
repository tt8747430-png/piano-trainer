import type { FloatingSettings, SettingsStore } from '@/entities/settings'

/** Changes where the floating actions stand, or whether they say their names, and keeps the rest. */
export function setFloating(store: SettingsStore, change: Partial<FloatingSettings>): void {
  store.setState((state) => ({ floating: { ...state.floating, ...change } }))
}
