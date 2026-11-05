import type { OwnProgressionId, PracticeLibraryStore } from '@/entities/practice-library'

/** Deletes the learner's progression and its favourite; its number is never given again. */
export function deleteProgression(store: PracticeLibraryStore, id: OwnProgressionId): void {
  store.setState((state) => ({
    progressions: state.progressions.filter((each) => each.id !== id),
    favourites: {
      ...state.favourites,
      progressions: state.favourites.progressions.filter((each) => each !== id),
    },
  }))
}
