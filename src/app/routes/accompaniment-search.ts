import { isPatternRef, type PatternRef } from '@/entities/pattern'
import type { Input, Raw } from './read-search'

/** A new pattern's search: the pattern it starts from (Make your own from it), if any. */
interface NewPatternSearch {
  readonly from?: PatternRef
}
export const validateNewPatternSearch = (input: Input<NewPatternSearch>): NewPatternSearch => {
  const raw: Raw = input
  return { from: isPatternRef(raw.from) ? raw.from : undefined }
}
