import { useTranslation } from 'react-i18next'
import { localText, useLocale } from '@/shared/i18n'
import { PATTERN_GROUP_ENTRIES } from '../content/patterns'
import type { PatternShelf } from '../model/shelves'

/**
 * A shelf's own name: Favourites, Your patterns, Hidden, or its built-in group's, as it reads under its
 * book's heading.
 */
export function useShelfName(): (shelf: PatternShelf) => string {
  const { t } = useTranslation('music')
  const locale = useLocale()
  return ({ shelf }) =>
    shelf === 'favourites' || shelf === 'own' || shelf === 'hidden'
      ? t(`patternShelf.${shelf}`)
      : localText(PATTERN_GROUP_ENTRIES[shelf].name, locale)
}
