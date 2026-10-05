import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  referenceShelves,
  selectFavourites,
  selectHidden,
  usePatternBook,
  usePatterns,
  useShelfName,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, RoundLink, RowGroup, RowLink, ScreenHeader } from '@/shared/ui'

/**
 * Patterns: the learner's favourites and own patterns, the built-in groups, and the hidden
 * at the end; each row a name and its idea in a line, opening its page. New pattern in the bar.
 */
export function PatternsPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const book = usePatternBook()
  const favourites = usePatterns(selectFavourites)
  const hidden = usePatterns(selectHidden)
  const shelves = useMemo(
    () => referenceShelves(book, { favourites, hidden }),
    [book, favourites, hidden],
  )
  const shelfName = useShelfName()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('patterns.title')}
        back={<BackButton fallback={{ to: '/practice', search: { topic: 'accompaniment' } }} />}
        actions={
          <RoundLink
            label={t('patterns.new')}
            icon={Plus}
            render={<Link to="/practice/patterns/new" />}
          />
        }
      />
      <div className="flex flex-col gap-8">
        {shelves.map((shelf) => (
          <RowGroup key={shelf.shelf} title={shelfName(shelf)}>
            {shelf.patterns.map((pattern) => (
              <li key={pattern.ref}>
                <RowLink
                  title={localText(pattern.name, locale)}
                  detail={localText(pattern.idea, locale)}
                  render={
                    <Link
                      to="/practice/patterns/$patternRef"
                      params={{ patternRef: pattern.ref }}
                    />
                  }
                />
              </li>
            ))}
          </RowGroup>
        ))}
      </div>
    </div>
  )
}
