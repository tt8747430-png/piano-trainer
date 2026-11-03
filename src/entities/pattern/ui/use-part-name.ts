import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_NAMES } from '@/entities/book'
import { localText, useLocale } from '@/shared/i18n'
import type { AccompanimentPart } from '../model/parts'

/** A part of Accompaniment by name: a method book's own, as printed, or Styles or Yours. */
export function usePartName(): (part: AccompanimentPart) => string {
  const { t } = useTranslation('music')
  const locale = useLocale()
  return (part) =>
    isMethodBookId(part) ? localText(METHOD_BOOK_NAMES[part], locale) : t(`patternPart.${part}`)
}
