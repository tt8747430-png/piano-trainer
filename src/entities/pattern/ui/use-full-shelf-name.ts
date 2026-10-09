import { METHOD_BOOK_NAMES } from '@/entities/book'
import { PATTERN_GROUP_ENTRIES } from '../content/patterns'
import type { PatternShelf } from '../model/shelves'
import { isPatternGroup } from '../model/types'
import { useShelfName } from './use-shelf-name'

/**
 * A shelf's name where every book's shelves are in one list (the Setup's picker): a method book's
 * group after its book's name.
 */
export function useFullShelfName(): (shelf: PatternShelf) => string {
  const shelfName = useShelfName()
  return (shelf) => {
    const book = isPatternGroup(shelf.shelf) ? PATTERN_GROUP_ENTRIES[shelf.shelf].book : null
    return book ? `${METHOD_BOOK_NAMES[book]} · ${shelfName(shelf)}` : shelfName(shelf)
  }
}
