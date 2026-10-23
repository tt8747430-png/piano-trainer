import type { SettingsStore } from '@/entities/settings'
import type { SheetView } from '@/shared/lib'

/** Lays the score editor's score out down the screen, on pages or as one line, and saves it (ADR 0064). */
export function setEditorLayout(store: SettingsStore, editorLayout: SheetView): void {
  store.setState({ editorLayout })
}
