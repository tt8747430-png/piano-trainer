import type { MelodySource, SettingsStore } from '@/entities/settings'

/** Saves what plays a song's melody along with the hands, for every song (ADR 0115). */
export function setMelody(store: SettingsStore, melody: MelodySource): void {
  store.setState({ melody })
}
