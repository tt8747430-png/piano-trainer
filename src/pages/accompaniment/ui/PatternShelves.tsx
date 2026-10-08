import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  referenceShelves,
  selectFavourites,
  selectHidden,
  usePatternBook,
  usePatterns,
  useShelfName,
  type ReferencePart,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { RowGroup, RowLink } from '@/shared/ui'
import { Empty, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

/**
 * One part of the patterns' reference: its shelves, each row a name and its idea in a line, opening
 * the pattern's page. With no shelf to show, the one line that says why: nothing kept yet on Yours,
 * every pattern hidden elsewhere.
 */
export function PatternShelves({ part }: { part: ReferencePart }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const book = usePatternBook()
  const favourites = usePatterns(selectFavourites)
  const hidden = usePatterns(selectHidden)
  const shelves = useMemo(
    () => referenceShelves(book, { favourites, hidden }, part),
    [book, favourites, hidden, part],
  )
  const shelfName = useShelfName()
  if (shelves.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>
            {part === 'yours' ? t('accompaniment.noneYours') : t('accompaniment.allHidden')}
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }
  return shelves.map((shelf) => (
    <RowGroup key={shelf.shelf} title={shelfName(shelf)}>
      {shelf.patterns.map((pattern) => (
        <li key={pattern.ref}>
          <RowLink
            title={localText(pattern.name, locale)}
            detail={localText(pattern.idea, locale)}
            render={
              <Link to="/practice/patterns/$patternRef" params={{ patternRef: pattern.ref }} />
            }
          />
        </li>
      ))}
    </RowGroup>
  ))
}
