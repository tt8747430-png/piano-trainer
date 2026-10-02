import { useTranslation } from 'react-i18next'
import { localText, useLocale } from '@/shared/i18n'
import { PATTERN_GROUP_NAMES } from '../content/patterns'
import type { PatternShelf } from '../model/shelves'

/** A shelf's name in a list of patterns: Favourites, Your patterns, Hidden, or its built-in group's. */
export function useShelfName(): (shelf: PatternShelf) => string {
  const { t } = useTranslation('music')
  const locale = useLocale()
  return ({ shelf }) =>
    shelf === 'favourites' || shelf === 'own' || shelf === 'hidden'
      ? t(`patternShelf.${shelf}`)
      : localText(PATTERN_GROUP_NAMES[shelf], locale)
}
