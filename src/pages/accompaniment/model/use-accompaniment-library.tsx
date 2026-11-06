import { Link } from '@tanstack/react-router'
import { AudioWaveform, GraduationCap, Heart, HeartOff, Music, UserRound } from 'lucide-react'
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
import { isSongCollectionId, METHOD_BOOK_PIECES } from '@/entities/piece'
import { toggleFavourite, toggleHidden } from '@/features/manage-patterns'
import { localText, useLocale } from '@/shared/i18n'
import { OPEN_PLAINLY } from '@/shared/lib'
import type { RowAction } from '@/shared/ui'
import { MINE, type LibraryGroup, type LibraryItem } from '@/widgets/practice-library'

/** The books Accompaniment lists, in its order: the method books, then the rhythm styles. */
const BOOKS: readonly AccompanimentPart[] = [...METHOD_BOOK_IDS, 'styles']

/** A link of a book's place to where the rest of its material is: its course, its songs. */
const BOOK_LINK =
  'inline-flex min-h-11 items-center gap-2 rounded-pill border border-input bg-card px-3 text-sm font-semibold transition-colors duration-200 ease-out hover:bg-muted'

/** The Songs folder that holds a method book's songs, where Songs lists one. */
function songsFolderOf(part: AccompanimentPart): string | undefined {
  if (!isMethodBookId(part)) return undefined
  const { id } = METHOD_BOOK_PIECES[part]
  if (isSongCollectionId(id)) return id
  return isSongCollectionId(part) ? part : undefined
}

/**
 * The Accompaniment library's books and rows (R30-4, R32): patterns only, each method book (Called to
 * Play, Called to Play 2, Боброва, Gorshkov) and the rhythm styles a place of its patterns, with links
 * to the book's course in Learn and its songs in Songs, kept apart from the patterns; the patterns the
 * learner made Mine. A built-in pattern hides as its page hides it (the Player's picker leaves it out
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
  const groups = BOOKS.map((part): LibraryGroup => {
    const course = isMethodBookId(part) ? courseById(part) : undefined
    const folder = songsFolderOf(part)
    return {
      id: part,
      name: partName(part),
      ...(course || folder
        ? {
            links: (
              <>
                {course ? (
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: course.id }}
                    state={OPEN_PLAINLY}
                    className={BOOK_LINK}
                  >
                    <GraduationCap aria-hidden className="size-4" />
                    {t('practice:library.links.course')}
                  </Link>
                ) : null}
                {folder ? (
                  <Link
                    to="/songs/folders/$folderId"
                    params={{ folderId: folder }}
                    state={OPEN_PLAINLY}
                    className={BOOK_LINK}
                  >
                    <Music aria-hidden className="size-4" />
                    {t('practice:library.links.songs')}
                  </Link>
                ) : null}
              </>
            ),
          }
        : {}),
    }
  })
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
