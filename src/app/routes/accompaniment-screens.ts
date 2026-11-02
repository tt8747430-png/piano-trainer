import {
  BUILT_IN_PATTERNS,
  isPatternId,
  partOfShelf,
  selectIsHidden,
  type AccompanimentPart,
  type PatternsStore,
} from '@/entities/pattern'

/**
 * The page of Accompaniment a pattern is listed on (rule 26): its book's shelf; the learner's own,
 * and a built-in one they hid, under Yours.
 */
export function patternPart(
  state: ReturnType<PatternsStore['getState']>,
  ref: string,
): AccompanimentPart {
  if (!isPatternId(ref) || selectIsHidden(ref)(state)) return 'yours'
  return partOfShelf(BUILT_IN_PATTERNS.require(ref).group)
}
export { AccompanimentPage } from '@/pages/accompaniment'
export { PatternPage, PatternPublishPage } from '@/pages/pattern'
export { EditPatternPage, NewPatternPage } from '@/pages/pattern-editor'
