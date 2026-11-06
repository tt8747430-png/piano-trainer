import { Link } from '@tanstack/react-router'
import { Heart, HeartOff, List, UserRound } from 'lucide-react'
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
  progressionMode,
  type ProgressionStyle,
} from '@/entities/progression-library'
import { togglePracticeFavourite } from '@/features/manage-practice-library'
import { localText, useLocale } from '@/shared/i18n'
import { numeralsLine, parseNumerals } from '@/shared/lib/music'
import type { Paint, RowAction } from '@/shared/ui'
import { MINE, type LibraryGroup, type LibraryItem } from '@/widgets/practice-library'

/** Each style's paint on its rows' picture, one picture for every style: a list of progressions. */
const STYLE_PAINT: Readonly<Record<ProgressionStyle, Paint>> = {
  pop: 'sky',
  rock: 'sand',
  jazz: 'lilac',
  blues: 'sky',
  classical: 'sand',
  soul: 'yellow',
  gospel: 'yellow',
  modal: 'lilac',
  theory: 'grass',
}

/**
 * The Progressions library's styles and rows (R30-4): each style of the library a place, each
 * progression its name, how it sounds and its numerals (in its major line where it has one); Mine the
 * progressions the learner keeps. The library has no levels, so it shows, sorts and filters by none.
 */
export function useProgressionLibrary(): {
  groups: readonly LibraryGroup[]
  items: readonly LibraryItem[]
} {
  const { t } = useTranslation(['practice', 'common'])
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
      const numerals = libraryLine(progression, progressionMode(progression, false))
      const favourite = favourites.includes(progression.id)
      return {
        id: progression.id,
        name: localText(progression.name, locale),
        detail: localText(progression.character, locale),
        phoneDetail: numerals,
        extra: numerals,
        group: style,
        words: [progression.name.en, progression.name.ru],
        icon: List,
        paint: STYLE_PAINT[style],
        link: link(progression.id),
        favourite,
        actions: [favouriteAction(progression.id, favourite)],
      }
    }),
  )
  const mine = own.map((progression): LibraryItem => {
    const numerals = numeralsLine(parseNumerals(progression.line) ?? [])
    const favourite = favourites.includes(progression.id)
    return {
      id: progression.id,
      name: progression.name,
      detail: numerals,
      extra: numerals,
      group: MINE,
      icon: UserRound,
      paint: 'sand',
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
