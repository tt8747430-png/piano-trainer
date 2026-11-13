import type { OwnPattern, OwnPatternId, PatternsStore } from '@/entities/pattern'

/** What a delete took, to put back as it was: the pattern, its place among the learner's, its star. */
export interface DeletedPattern {
  readonly pattern: OwnPattern
  readonly at: number
  readonly favourite: boolean
}

/**
 * Deletes the learner's pattern and its star, and returns what it took for its Undo (R38); its
 * number is never given again.
 */
export function deleteOwnPattern(store: PatternsStore, id: OwnPatternId): DeletedPattern | null {
  const { own, favourites } = store.getState()
  const at = own.findIndex((pattern) => pattern.id === id)
  const pattern = own[at]
  if (!pattern) return null
  store.setState((state) => ({
    own: state.own.filter((each) => each.id !== id),
    favourites: state.favourites.filter((ref) => ref !== id),
  }))
  return { pattern, at, favourite: favourites.includes(id) }
}

/** Puts a deleted pattern back in its place, with its star: the delete's Undo. */
export function restoreOwnPattern(store: PatternsStore, deleted: DeletedPattern): void {
  const { pattern, at, favourite } = deleted
  store.setState((state) =>
    state.own.some((each) => each.id === pattern.id)
      ? state
      : {
          own: state.own.toSpliced(at, 0, pattern),
          favourites: favourite ? [...state.favourites, pattern.id] : state.favourites,
        },
  )
}
