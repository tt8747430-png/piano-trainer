import type { PracticeKind, PracticeLibraryStore } from '@/entities/practice-library'
import { toggled } from '@/shared/lib'

/** Makes one of a kind (an exercise, a progression) a favourite, at the end of its kind's, or not. */
export function togglePracticeFavourite(
  store: PracticeLibraryStore,
  kind: PracticeKind,
  id: string,
): void {
  store.setState((state) => ({
    favourites: { ...state.favourites, [kind]: toggled(state.favourites[kind], id) },
  }))
}
