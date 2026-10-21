import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_NAMES } from '@/entities/book'
import type { AccompanimentPart } from '../model/parts'

/** A part of Accompaniment by name: a method book's own, as printed, or Styles or Yours. */
export function usePartName(): (part: AccompanimentPart) => string {
  const { t } = useTranslation('music')
  return (part) => (isMethodBookId(part) ? METHOD_BOOK_NAMES[part] : t(`patternPart.${part}`))
}
