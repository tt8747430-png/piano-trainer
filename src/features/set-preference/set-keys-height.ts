import type { KeysScreenSize, SettingsStore } from '@/entities/settings'

/** Keeps the keys' height the divider set for one size of screen (R34), or forgets it (null). */
export function setKeysHeight(
  store: SettingsStore,
  size: KeysScreenSize,
  height: number | null,
): void {
  store.setState((state) => ({ keysHeight: { ...state.keysHeight, [size]: height } }))
}
