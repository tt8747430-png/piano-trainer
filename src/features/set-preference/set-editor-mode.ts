import type { EditorStartMode, SettingsStore } from '@/entities/settings'

/** Keeps the mode the score editor writes in, so it opens as it was left (R31-E). */
export function setEditorMode(store: SettingsStore, mode: EditorStartMode): void {
  store.setState({ editorMode: mode })
}
