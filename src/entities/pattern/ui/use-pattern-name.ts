import { localText, useLocale } from '@/shared/i18n'
import { usePatternBook } from '../model/use-pattern-book'
import { isPatternRef } from '../model/own'

/**
 * A pattern by its name in the book, the learner's own too (a performed chord's `pattern`); none for
 * one the book does not hold.
 */
export function usePatternName(): (ref: string) => string | undefined {
  const book = usePatternBook()
  const locale = useLocale()
  return (ref) => {
    const entry = isPatternRef(ref) ? book.get(ref) : undefined
    return entry ? localText(entry.name, locale) : undefined
  }
}
