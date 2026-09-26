import type { KeyboardSettings, SettingsStore } from '@/entities/settings'

/** Changes the keyboard settings it is given and keeps the rest: the rail's popover and Settings write here. */
export function setKeyboard(store: SettingsStore, change: Partial<KeyboardSettings>): void {
  store.setState((state) => ({ keyboard: { ...state.keyboard, ...change } }))
}
