import type { PatternId, PatternsStore } from '@/entities/pattern'
import { toggled } from '@/shared/lib'

/** Hides a built-in pattern from the Setup's picker, or shows it again. */
export function toggleHidden(store: PatternsStore, id: PatternId): void {
  store.setState((state) => ({ hidden: toggled(state.hidden, id) }))
}
