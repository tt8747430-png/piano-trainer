import { Link } from '@tanstack/react-router'
import { AudioWaveform, Heart, HeartOff, Music, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_IDS } from '@/entities/book'
import { courseById, pieceStage } from '@/entities/course'
import {
  selectFavourites as selectSongFavourites,
  useLibrary,
  useLibraryStoreApi,
} from '@/entities/library'
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
} from '@/entities/pattern'
import {
  entryTitles,
  METHOD_BOOK_PIECES,
  PieceLink,
  pieceChords,
  useRepertoire,
} from '@/entities/piece'
import { selectAccompaniment, useSettings } from '@/entities/settings'
import { toggleFavourite as toggleSongFavourite } from '@/features/manage-library'
import { toggleFavourite as togglePatternFavourite } from '@/features/manage-patterns'
import { localText, useLocale } from '@/shared/i18n'
import { printedSymbol } from '@/shared/lib/music'
import type { RowAction } from '@/shared/ui'
import { HIDDEN, MINE, type LibraryGroup, type LibraryItem } from '@/widgets/practice-library'

/** The books Accompaniment lists, in its order: the method books, then the rhythm styles. */
const BOOKS: readonly AccompanimentPart[] = [...METHOD_BOOK_IDS, 'styles']

/** Between a study's first chords on its row's line. */
const CHORD_DASH = ' – '

/**
 * The Accompaniment library's books and rows (R30-4): each method book (Called to Play, Called to
 * Play 2, Bobrova, Gorshkov) and the rhythm styles a place, its patterns then the songs they are
 * practised on; the patterns the learner made Mine, the built-in ones they hid Hidden; a book hidden
 * on Accompaniment's Settings left out, and Mine with Yours. A pattern's level is its book's
 * course's, a song's its own; the styles' patterns and the learner's have none.
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
  const songFavourites = useLibrary(selectSongFavourites)
  const library = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const { hidden: away } = useSettings(selectAccompaniment)
  const shown = (part: AccompanimentPart) => !away.includes(part)
  const groups = BOOKS.filter(shown).map((part) => ({ id: part, name: partName(part) }))
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
      icon: group === MINE ? UserRound : AudioWaveform,
      paint: group === MINE ? 'sand' : 'yellow',
      link: (
        <Link
          to="/practice/accompaniment/patterns/$patternRef"
          params={{ patternRef: pattern.ref }}
        />
      ),
      favourite,
      actions: [favouriteAction(favourite, () => togglePatternFavourite(patterns, pattern.ref))],
    }
  }
  const builtIn = PATTERN_GROUPS.flatMap((group) => {
    const part = partOfShelf(group)
    if (!shown(part)) return []
    const stage = isMethodBookId(part) ? courseById(part)?.stage : undefined
    const shelf = shelfName({ shelf: group, patterns: [] })
    return patternsIn(group).flatMap((id) => {
      const pattern = book.get(id)
      if (!pattern) return []
      return [patternItem(pattern, hidden.includes(id) ? HIDDEN : part, shelf, stage)]
    })
  })
  const songs = METHOD_BOOK_IDS.filter(shown).flatMap((part) => {
    const collection = METHOD_BOOK_PIECES[part]
    const section = {
      id: `${part}:songs`,
      name: t('practice:library.songsOf', { book: partName(part) }),
    }
    return collection.entries.map((each): LibraryItem => {
      const entry = repertoire.entry(each.id) ?? each
      const { primary, secondary } = entryTitles(entry, locale)
      const stage = pieceStage(entry.id)
      const favourite = songFavourites.includes(entry.id)
      return {
        id: `piece:${entry.id}`,
        name: primary,
        detail: secondary ?? pieceChords(entry).map(printedSymbol).join(CHORD_DASH),
        group: part,
        section,
        ...(stage ? { stage } : {}),
        words: [localText(collection.name, locale)],
        icon: Music,
        paint: 'grass',
        link: <PieceLink entry={entry} />,
        favourite,
        actions: [favouriteAction(favourite, () => toggleSongFavourite(library, entry.id))],
      }
    })
  })
  const mine = shown('yours')
  const own = mine
    ? book.own.map((pattern) =>
        patternItem(pattern, MINE, shelfName({ shelf: 'own', patterns: [] }), undefined),
      )
    : []
  // Each book's patterns, then its songs; the styles; Mine; the hidden.
  const byBook = groups.flatMap((group) => [
    ...builtIn.filter((item) => item.group === group.id),
    ...songs.filter((item) => item.group === group.id),
  ])
  return {
    groups,
    items: [...byBook, ...own, ...builtIn.filter((item) => item.group === HIDDEN)],
    mine,
  }
}
