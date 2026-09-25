import { canonicalFamilies, type SettingsStore } from '@/entities/settings'
import type { ChordFamily } from '@/shared/lib/music'

/** Saves the quiz's chord families in table order; the quiz always asks about at least one. */
export function setQuizFamilies(store: SettingsStore, families: readonly ChordFamily[]): void {
  const chosen = canonicalFamilies(families)
  if (chosen.length === 0) return
  store.setState((state) => ({ quiz: { ...state.quiz, families: chosen } }))
}
