import type { PatternRef, PatternsStore } from '@/entities/pattern'
import { toggled } from '@/shared/lib'

/** Stars a pattern (at the end of the favourites), or unstars it. */
export function toggleFavourite(store: PatternsStore, ref: PatternRef): void {
  store.setState((state) => ({ favourites: toggled(state.favourites, ref) }))
}
