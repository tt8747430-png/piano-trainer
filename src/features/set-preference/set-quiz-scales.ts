import { canonicalScales, type SettingsStore } from '@/entities/settings'
import type { ScaleKind } from '@/shared/lib/music'

/** Saves the quiz's scale kinds in table order; the quiz always asks about at least one. */
export function setQuizScales(store: SettingsStore, scales: readonly ScaleKind[]): void {
  const chosen = canonicalScales(scales)
  if (chosen.length === 0) return
  store.setState((state) => ({ quiz: { ...state.quiz, scales: chosen } }))
}
