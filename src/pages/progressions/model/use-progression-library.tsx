import { Link } from '@tanstack/react-router'
import { Heart, HeartOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectFavouritesOf,
  selectOwnProgressions,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
} from '@/entities/practice-library'
import {
  libraryByStyle,
  libraryLine,
  libraryNumerals,
  progressionMode,
  type ProgressionStyle,
} from '@/entities/progression-library'
import { togglePracticeFavourite } from '@/features/manage-practice-library'
import { localText, useLocale } from '@/shared/i18n'
import { numeralsLine, numeralText, parseNumerals, type Numeral } from '@/shared/lib/music'
import type { Paint, RowAction } from '@/shared/ui'
import { MINE, type LibraryGroup, type LibraryItem } from '@/widgets/practice-library'

/** A style's paint on its rows' tiles (canvas, Progressions): one paint, one meaning on the page. */
const STYLE_PAINT: Readonly<Record<ProgressionStyle, Paint>> = {
  pop: 'yellow',
  rock: 'sand',
  jazz: 'sky',
  blues: 'lilac',
  classical: 'grass',
  soul: 'lilac',
  gospel: 'yellow',
  modal: 'sky',
  theory: 'sand',
}

/** A progression's tile: its first two numerals, as it opens ("I V"), its first alone where two would not fit. */
const opening = (numerals: readonly Numeral[]): string => {
  const [first, second] = numerals.map(numeralText)
  const both = `${first ?? ''} ${second ?? ''}`.trim()
  return both.length <= 4 ? both : (first ?? '')
}

/** Numerals as a row reads them, spaced: "I – V – vi – IV". */
const spaced = (line: string): string => line.split('–').join(' – ')

/**
 * The Progressions library's styles and rows (canvas, Progressions): each style of the library a
 * place, each progression its opening on its style's paint, its name over its numerals (in its major
 * line where it has one), how it sounds found by the search; Mine the progressions the learner keeps. The library has no levels, so it shows, sorts and filters by none.
 */
export function useProgressionLibrary(): {
  groups: readonly LibraryGroup[]
  items: readonly LibraryItem[]
} {
  const { t } = useTranslation(['practice', 'common', 'music'])
  const locale = useLocale()
  const favourites = usePracticeLibrary(selectFavouritesOf('progressions'))
  const own = usePracticeLibrary(selectOwnProgressions)
  const store = usePracticeLibraryStoreApi()
  const styles = libraryByStyle().filter((style) => style.progressions.length > 0)
  const favouriteAction = (id: string, favourite: boolean): RowAction => ({
    key: 'favourite',
    label: t(favourite ? 'common:library.unfavourite' : 'common:library.favourite'),
    icon: favourite ? HeartOff : Heart,
    paint: 'sand',
    onSelect: () => togglePracticeFavourite(store, 'progressions', id),
  })
  const link = (id: string) => (
    <Link to="/practice/progressions/$progressionId" params={{ progressionId: id }} />
  )
  const library = styles.flatMap(({ style, progressions }) =>
    progressions.map((progression): LibraryItem => {
      const minor = progressionMode(progression, false)
      const numerals = libraryLine(progression, minor)
      const favourite = favourites.includes(progression.id)
      return {
        id: progression.id,
        name: localText(progression.name, locale),
        detail: spaced(numerals),
        extra: numerals,
        group: style,
        words: [
          progression.name.en,
          progression.name.ru,
          progression.character.en,
          progression.character.ru,
        ],
        picture: { text: opening(libraryNumerals(progression, minor)), paint: STYLE_PAINT[style] },
        link: link(progression.id),
        favourite,
        actions: [favouriteAction(progression.id, favourite)],
      }
    }),
  )
  const mine = own.map((progression): LibraryItem => {
    const parsed = parseNumerals(progression.line) ?? []
    const favourite = favourites.includes(progression.id)
    return {
      id: progression.id,
      name: progression.name,
      detail: spaced(numeralsLine(parsed)),
      extra: numeralsLine(parsed),
      group: MINE,
      picture: { text: opening(parsed), paint: 'sand' },
      link: link(progression.id),
      favourite,
      actions: [favouriteAction(progression.id, favourite)],
    }
  })
  return {
    groups: styles.map(({ style }) => ({
      id: style,
      name: t(`practice:progressions.style.${style}`),
    })),
    items: [...library, ...mine],
  }
}
