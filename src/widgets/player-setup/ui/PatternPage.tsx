import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  patternNeed,
  pickerShelves,
  selectFavourites,
  selectHidden,
  usePatternBook,
  usePatterns,
  type PatternChoice,
  type PatternFit,
  useShelfName,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { PAGE_TILES, RowLink } from '@/shared/ui'
import { ListPage } from './ListPage'

/**
 * The sheet's page of patterns: From the chart first where the chart names its methods, then the
 * learner's favourites and own patterns and the built-in groups, the hidden left out but for the one
 * playing. A row is a name and its idea in a line; a pattern the music cannot play is closed with what
 * it needs. At its foot, making your own pattern, and the Patterns page, where each is explained and
 * the list is kept.
 */
export function PatternPage({
  value,
  fit,
  onChoose,
  onBack,
}: {
  value: PatternChoice
  fit: PatternFit
  onChoose: (pattern: PatternChoice) => void
  onBack: () => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const book = usePatternBook()
  const favourites = usePatterns(selectFavourites)
  const hidden = usePatterns(selectHidden)
  const shelfName = useShelfName()
  return (
    <ListPage
      label={t('pattern')}
      onBack={onBack}
      groups={[
        ...(fit.methodCodes
          ? [
              {
                choices: [
                  {
                    key: 'chart',
                    label: t('fromChart'),
                    note: t('fromChartDescription'),
                    selected: value === 'chart',
                    onChoose: () => onChoose('chart'),
                  },
                ],
              },
            ]
          : []),
        ...pickerShelves(book, { favourites, hidden }, value).map((shelf) => ({
          label: shelfName(shelf),
          choices: shelf.patterns.map((pattern) => {
            const need = patternNeed(pattern, fit)
            return {
              key: `${shelf.shelf}:${pattern.ref}`,
              label: localText(pattern.name, locale),
              note: need ? t(`needs.${need}`) : localText(pattern.idea, locale),
              selected: value === pattern.ref,
              disabled: need !== null,
              onChoose: () => onChoose(pattern.ref),
            }
          }),
        })),
      ]}
    >
      <RowLink
        title={t('ownPattern')}
        detail={t('ownPatternDetail')}
        icon={Plus}
        paint="grass"
        render={<Link to="/practice/patterns/new" />}
      />
      <RowLink
        title={t('allPatterns')}
        {...PAGE_TILES.patterns}
        render={<Link to="/practice/patterns" />}
      />
    </ListPage>
  )
}
