import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  PATTERN_GROUP_NAMES,
  patternNeed,
  pickerShelves,
  selectFavourites,
  selectHidden,
  usePatternBook,
  usePatterns,
  type PatternChoice,
  type PatternFit,
  type PatternShelf,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { LEARN_TILES, RowLink } from '@/shared/ui'
import { ListPage } from './ListPage'

/**
 * The sheet's page of patterns: From the chart first where the chart names its methods, then the
 * learner's favourites and own patterns and the built-in groups, the hidden left out but for the one
 * playing. A row is a name and its idea in a line; a pattern the music cannot play is closed with what
 * it needs. At the foot, the way to Learn's Patterns, where each is explained and the list is kept.
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
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const book = usePatternBook()
  const favourites = usePatterns(selectFavourites)
  const hidden = usePatterns(selectHidden)
  const shelfName = ({ shelf }: PatternShelf) =>
    shelf === 'favourites' || shelf === 'own' || shelf === 'hidden'
      ? t(`music:patternShelf.${shelf}`)
      : localText(PATTERN_GROUP_NAMES[shelf], locale)
  return (
    <ListPage
      label={t('player:pattern')}
      onBack={onBack}
      groups={[
        ...(fit.methodCodes
          ? [
              {
                choices: [
                  {
                    key: 'chart',
                    label: t('player:fromChart'),
                    note: t('player:fromChartDescription'),
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
              note: need ? t(`player:needs.${need}`) : localText(pattern.idea, locale),
              selected: value === pattern.ref,
              disabled: need !== null,
              onChoose: () => onChoose(pattern.ref),
            }
          }),
        })),
      ]}
    >
      <RowLink
        title={t('player:patternsInLearn')}
        {...LEARN_TILES.patterns}
        render={<Link to="/learn/patterns" />}
      />
    </ListPage>
  )
}
