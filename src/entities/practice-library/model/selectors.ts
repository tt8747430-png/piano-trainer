import type { ArrangedLibrary, Arrangement } from './arrangement'
import type { PracticeLibraryState } from './store'
import type { OwnProgression, OwnProgressionId, PracticeKind } from './types'

/** A kind's favourites, in the order starred. */
export const selectFavouritesOf =
  (kind: PracticeKind) =>
  (state: PracticeLibraryState): readonly string[] =>
    state.favourites[kind]

/** Whether the learner made this one of a kind a favourite. */
export const selectIsFavouriteOf =
  (kind: PracticeKind, id: string) =>
  (state: PracticeLibraryState): boolean =>
    state.favourites[kind].includes(id)

/** The learner's own progressions, Mine, in the order made. */
export const selectOwnProgressions = (state: PracticeLibraryState): readonly OwnProgression[] =>
  state.progressions

/** The learner's own progression with this id, while it is there. */
export const selectOwnProgression =
  (id: OwnProgressionId) =>
  (state: PracticeLibraryState): OwnProgression | undefined =>
    state.progressions.find((progression) => progression.id === id)

/** How the learner arranged a library (R32). */
export const selectArrangement =
  (library: ArrangedLibrary) =>
  (state: PracticeLibraryState): Arrangement =>
    state.arrangements[library]
