import type { KeysScreenSize, KeysWindow, SettingsStore } from '@/entities/settings'

/** Keeps where the keys' window stands for one size of screen (loop round 24), or forgets it (null). */
export function setKeysWindow(
  store: SettingsStore,
  size: KeysScreenSize,
  window: KeysWindow | null,
): void {
  store.setState((state) => ({ keysWindow: { ...state.keysWindow, [size]: window } }))
}
