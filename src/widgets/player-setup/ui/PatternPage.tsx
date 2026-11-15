import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURES,
  patternNeed,
  pickerShelves,
  selectFavourites,
  selectHidden,
  usePatternBook,
  usePatterns,
  type PatternChoice,
  type PatternFit,
  RIGHT_FIGURES,
  useFullShelfName,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { PAGE_TILES, RowLink } from '@/shared/ui'
import { FigureRoll } from './FigureRoll'
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
}: {
  value: PatternChoice
  fit: PatternFit
  onChoose: (pattern: PatternChoice) => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const book = usePatternBook()
  const favourites = usePatterns(selectFavourites)
  const hidden = usePatterns(selectHidden)
  const shelfName = useFullShelfName()
  return (
    <ListPage
      label={t('pattern')}
      groups={[
        ...(fit.methodCodes
          ? [
              {
                choices: [
                  {
                    key: 'chart',
                    label: t('fromChart'),
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
              // Its two hands' bars, not a line saying what it is (an option carries no explanation).
              ...(need ? { note: t(`needs.${need}`) } : {}),
              picture: (
                <span aria-hidden className="flex shrink-0 gap-1.5 text-muted-foreground">
                  <FigureRoll hand="lh" figure={LEFT_FIGURES[pattern.lh].figure} />
                  <FigureRoll hand="rh" figure={RIGHT_FIGURES[pattern.rh].figure} />
                </span>
              ),
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
        icon={Plus}
        paint="grass"
        render={<Link to="/practice/accompaniment/patterns/new" />}
      />
      <RowLink
        title={t('allPatterns')}
        {...PAGE_TILES.patterns}
        render={<Link to="/practice/accompaniment" />}
      />
    </ListPage>
  )
}
