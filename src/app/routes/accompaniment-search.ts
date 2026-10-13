import type { AccompanimentView } from '@/pages/accompaniment'
import { isAccompanimentPart, isPatternRef, type PatternRef } from '@/entities/pattern'
import { valueOr } from '@/shared/lib'
import { routeSearch, type Input, type Raw } from './read-search'

// Accompaniment: the page of it shown, its first method book's unless the URL names another.
const ACCOMPANIMENT_DEFAULTS: AccompanimentView = { show: 'called-to-play' }
export function readAccompanimentSearch(raw: Raw): AccompanimentView {
  return { show: valueOr(isAccompanimentPart, raw.show, ACCOMPANIMENT_DEFAULTS.show) }
}
export const accompanimentSearch = routeSearch(readAccompanimentSearch, ACCOMPANIMENT_DEFAULTS)

/** A new pattern's search: the pattern it starts from (Make your own from it), if any. */
interface NewPatternSearch {
  readonly from?: PatternRef
}
export const validateNewPatternSearch = (input: Input<NewPatternSearch>): NewPatternSearch => {
  const raw: Raw = input
  return { from: isPatternRef(raw.from) ? raw.from : undefined }
}
