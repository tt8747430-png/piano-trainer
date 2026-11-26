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
} from '@/entities/progression-library'
import { togglePracticeFavourite } from '@/features/manage-practice-library'
import { localText, useLocale } from '@/shared/i18n'
import { numeralsLine, parseNumerals } from '@/shared/lib/music'
import type { RowAction } from '@/shared/ui'
import { MINE, type KeyMode, type LibraryGroup, type LibraryItem } from '@/widgets/practice-library'

/**
 * The Progressions library's styles and rows (canvas, Progressions): each style of the library a
 * place, each progression its chords as columns in their roles' paints, its name over its numerals (in its major
 * line where it has one, its minor one while the Key filter keeps Minor key), how it sounds found by the search;
 * Mine the progressions the learner keeps. It filters by key (Major key, Minor key), never by level.
 */
export function useProgressionLibrary(mode: KeyMode | 'any'): {
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
      const minor = progressionMode(progression, mode === 'minor')
      const numerals = libraryLine(progression, minor)
      const favourite = favourites.includes(progression.id)
      return {
        id: progression.id,
        name: localText(progression.name, locale),
        detail: numerals,
        third: t(minor ? 'music:key.minorMode' : 'music:key.majorMode'),
        modes: [
          ...(progression.major === undefined ? [] : ['major' as const]),
          ...(progression.minor === undefined ? [] : ['minor' as const]),
        ],
        group: style,
        words: [
          progression.name.en,
          progression.name.ru,
          progression.character.en,
          progression.character.ru,
          numerals,
        ],
        picture: { chords: libraryNumerals(progression, minor), minor },
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
      detail: numeralsLine(parsed),
      third: t(progression.minor ? 'music:key.minorMode' : 'music:key.majorMode'),
      modes: [progression.minor ? 'minor' : 'major'],
      words: [numeralsLine(parsed)],
      group: MINE,
      // Its own mode paints its roles, as the library's do.
      picture: { chords: parsed, minor: progression.minor },
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
