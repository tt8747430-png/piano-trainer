import type { OwnPattern, OwnPatternId, PatternRef } from './own'
import type { PatternsState } from './store'
import type { PatternId } from './types'

/** Whether the learner starred this pattern. */
export const selectIsFavourite =
  (ref: PatternRef) =>
  (state: PatternsState): boolean =>
    state.favourites.includes(ref)

/** Whether the learner hid this built-in pattern from the picker. */
export const selectIsHidden =
  (id: PatternId) =>
  (state: PatternsState): boolean =>
    state.hidden.includes(id)

/** The learner's own pattern with this id, while it is there. */
export const selectOwnPattern =
  (id: OwnPatternId) =>
  (state: PatternsState): OwnPattern | undefined =>
    state.own.find((pattern) => pattern.id === id)

export const selectFavourites = (state: PatternsState) => state.favourites
export const selectHidden = (state: PatternsState) => state.hidden
