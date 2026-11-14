import { AudioWaveform, Heart, HeartOff, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_IDS } from '@/entities/book'
import { courseById } from '@/entities/course'
import {
  LEFT_FIGURES,
  partOfShelf,
  PATTERN_GROUPS,
  patternsIn,
  RIGHT_FIGURES,
  selectFavourites,
  selectHidden,
  usePartName,
  usePatternBook,
  usePatterns,
  usePatternsStoreApi,
  useShelfName,
  type AccompanimentPart,
  type BookPattern,
  type PatternId,
} from '@/entities/pattern'
import { toggleFavourite, toggleHidden } from '@/features/manage-patterns'
import { localText, useLocale } from '@/shared/i18n'
import type { RowAction } from '@/shared/ui'
import { MINE, type LibraryGroup, type LibraryItem } from '@/widgets/practice-library'

/** The books Accompaniment lists, in its order: the method books, then the rhythm styles. */
const BOOKS: readonly AccompanimentPart[] = [...METHOD_BOOK_IDS, 'styles']

/**
 * The Accompaniment library's books and rows (R30-4, R32): patterns only, each method book (Called to
 * Play, Called to Play 2, Боброва, Gorshkov) and the rhythm styles a place of its patterns, and the
 * patterns the learner made Mine; the books' courses and songs are Learn's and Songs'. A built-in pattern hides as its page hides it (the Player's picker leaves it out
 * too), so Hidden and the picker agree. A pattern's level is its book's course's; the styles' and the
 * learner's have none.
 */
export function useAccompanimentLibrary(): {
  groups: readonly LibraryGroup[]
  items: readonly LibraryItem[]
  mine: boolean
} {
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const partName = usePartName()
  const shelfName = useShelfName()
  const book = usePatternBook()
  const favourites = usePatterns(selectFavourites)
  const hidden = usePatterns(selectHidden)
  const patterns = usePatternsStoreApi()
  const groups = BOOKS.map((part): LibraryGroup => ({ id: part, name: partName(part) }))
  const favouriteAction = (favourite: boolean, onSelect: () => void): RowAction => ({
    key: 'favourite',
    label: t(favourite ? 'common:library.unfavourite' : 'common:library.favourite'),
    icon: favourite ? HeartOff : Heart,
    paint: 'sand',
    onSelect,
  })
  const hands = (pattern: BookPattern) =>
    t('practice:library.handsLine', {
      left: localText(LEFT_FIGURES[pattern.lh].name, locale),
      right: localText(RIGHT_FIGURES[pattern.rh].name, locale),
    })
  const patternItem = (
    pattern: BookPattern,
    group: string,
    shelf: string,
    stage: LibraryItem['stage'],
    builtIn?: PatternId,
  ): LibraryItem => {
    const favourite = favourites.includes(pattern.ref)
    return {
      id: `pattern:${pattern.ref}`,
      name: localText(pattern.name, locale),
      detail: localText(pattern.idea, locale),
      group,
      ...(stage ? { stage } : {}),
      extra: hands(pattern),
      words: [shelf],
      picture:
        group === MINE
          ? { icon: UserRound, paint: 'sand' }
          : { icon: AudioWaveform, paint: 'yellow' },
      link: (
        <Link
          to="/practice/accompaniment/patterns/$patternRef"
          params={{ patternRef: pattern.ref }}
        />
      ),
      favourite,
      actions: [favouriteAction(favourite, () => toggleFavourite(patterns, pattern.ref))],
      ...(builtIn
        ? {
            hide: {
              hidden: hidden.includes(builtIn),
              toggle: () => toggleHidden(patterns, builtIn),
            },
          }
        : {}),
    }
  }
  const builtInItems = PATTERN_GROUPS.flatMap((group) => {
    const part = partOfShelf(group)
    if (part === 'yours') return []
    const stage = isMethodBookId(part) ? courseById(part)?.stage : undefined
    const shelf = shelfName({ shelf: group, patterns: [] })
    return patternsIn(group).flatMap((id) => {
      const pattern = book.get(id)
      return pattern ? [patternItem(pattern, part, shelf, stage, id)] : []
    })
  })
  const own = book.own.map((pattern) =>
    patternItem(pattern, MINE, shelfName({ shelf: 'own', patterns: [] }), undefined),
  )
  // Each book's patterns in the books' order, then the learner's own.
  const byBook = BOOKS.flatMap((part) => builtInItems.filter((item) => item.group === part))
  return { groups, items: [...byBook, ...own], mine: true }
}
