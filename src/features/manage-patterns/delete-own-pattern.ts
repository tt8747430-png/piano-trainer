import type { OwnPatternId, PatternsStore } from '@/entities/pattern'

/** Deletes the learner's pattern and its star; its number is never given again. */
export function deleteOwnPattern(store: PatternsStore, id: OwnPatternId): void {
  store.setState((state) => ({
    own: state.own.filter((pattern) => pattern.id !== id),
    favourites: state.favourites.filter((ref) => ref !== id),
  }))
}
