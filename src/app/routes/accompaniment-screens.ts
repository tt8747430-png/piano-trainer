import { METHOD_BOOK_IDS } from '@/entities/book'
import {
  BUILT_IN_PATTERNS,
  isPatternId,
  partOfShelf,
  selectIsHidden,
  type PatternsStore,
} from '@/entities/pattern'
import { METHOD_BOOK_PIECES } from '@/entities/piece'

/**
 * The place of Accompaniment's library a pattern is listed in (rule 26): its book; the learner's own
 * in Mine, a built-in one they hid in Hidden.
 */
export function patternPlace(state: ReturnType<PatternsStore['getState']>, ref: string): string {
  if (!isPatternId(ref)) return 'mine'
  if (selectIsHidden(ref)(state)) return 'hidden'
  return partOfShelf(BUILT_IN_PATTERNS.require(ref).group)
}

/** The book of Accompaniment's library a study is practised in; All for one no book holds. */
export function studyPlace(pieceId: string): string {
  const book = METHOD_BOOK_IDS.find((id) =>
    METHOD_BOOK_PIECES[id].entries.some((entry) => entry.id === pieceId),
  )
  return book ?? 'all'
}
export { AccompanimentPage } from '@/pages/accompaniment'
export { PatternPage, PatternPublishPage } from '@/pages/pattern'
export { EditPatternPage, NewPatternPage } from '@/pages/pattern-editor'
