import type {
  OwnProgression,
  OwnProgressionId,
  PracticeLibraryStore,
} from '@/entities/practice-library'

/** What a delete took, to put back as it was: the progression, its place in Mine, its favourite. */
export interface DeletedProgression {
  readonly progression: OwnProgression
  readonly at: number
  readonly favourite: boolean
}

/**
 * Deletes the learner's progression and its favourite, and returns what it took for its Undo
 * (R38); its number is never given again.
 */
export function deleteProgression(
  store: PracticeLibraryStore,
  id: OwnProgressionId,
): DeletedProgression | null {
  const { progressions, favourites } = store.getState()
  const at = progressions.findIndex((each) => each.id === id)
  const progression = progressions[at]
  if (!progression) return null
  store.setState((state) => ({
    progressions: state.progressions.filter((each) => each.id !== id),
    favourites: {
      ...state.favourites,
      progressions: state.favourites.progressions.filter((each) => each !== id),
    },
  }))
  return { progression, at, favourite: favourites.progressions.includes(id) }
}

/** Puts a deleted progression back in its place in Mine, with its favourite: the delete's Undo. */
export function restoreProgression(store: PracticeLibraryStore, deleted: DeletedProgression): void {
  const { progression, at, favourite } = deleted
  store.setState((state) =>
    state.progressions.some((each) => each.id === progression.id)
      ? state
      : {
          progressions: state.progressions.toSpliced(at, 0, progression),
          favourites: favourite
            ? {
                ...state.favourites,
                progressions: [...state.favourites.progressions, progression.id],
              }
            : state.favourites,
        },
  )
}
