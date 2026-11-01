import type { EditingSettings, SettingsStore } from '@/entities/settings'

/** Saves how the score editor writes: whether a note sounds as it is edited. */
export function setEditing(store: SettingsStore, change: Partial<EditingSettings>): void {
  store.setState((state) => ({ editing: { ...state.editing, ...change } }))
}
