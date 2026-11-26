import { PATTERN_GROUP_ENTRIES } from '../content/patterns'
import { isPatternGroup, type PatternGroup } from './types'
import type { AccompanimentPart } from './parts'

/** A titled run of patterns: the learner's favourites or own, a built-in group, the hidden. */
export interface PatternShelf {
  readonly shelf: 'favourites' | 'own' | PatternGroup | 'hidden'
}

/** The part a shelf is on: a group's book's, Styles for a group of no book, Yours for the learner's. */
export const partOfShelf = (shelf: PatternShelf['shelf']): AccompanimentPart =>
  isPatternGroup(shelf) ? (PATTERN_GROUP_ENTRIES[shelf].book ?? 'styles') : 'yours'
