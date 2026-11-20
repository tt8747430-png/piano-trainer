import { useTranslation } from 'react-i18next'
import type { BookPattern, PatternChoice } from '@/entities/pattern'
import { selectRecent, usePracticeLibrary } from '@/entities/practice-library'
import { useLocale } from '@/shared/i18n'
import {
  FAVOURITES,
  HIDDEN,
  libraryShown,
  MINE,
  patternItemId,
  RECENT,
  useAccompanimentLibrary,
  useLibraryArrangement,
  type LibraryGroup,
  type LibraryShown,
  type PracticeLibraryView,
} from '@/widgets/practice-library'

/** The Accompaniment library as the Pattern sheet reads it. */
export interface PatternLibrary {
  /** The library's books, styles and the learner's folders, as arranged. */
  readonly groups: readonly LibraryGroup[]
  /** What `view` shows. */
  readonly shown: LibraryShown
  /** Each row's pattern by its id. */
  readonly patterns: ReadonlyMap<string, BookPattern>
  /** The runs' names: Recently used, Favourites, Mine, Hidden. */
  readonly names: Readonly<Record<string, string>>
}

/**
 * The Accompaniment library for the Player's Pattern sheet (R30-4, the board's `patItems`): the same
 * rows, arranged as the learner arranged them, searched, placed, levelled and sorted by `view`. A
 * hidden pattern is left out but for the one playing, which stays in its own place.
 */
export function usePatternLibrary(
  view: PracticeLibraryView,
  chosen: PatternChoice,
): PatternLibrary {
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const library = useAccompanimentLibrary()
  const arranged = useLibraryArrangement({
    kind: 'accompaniment',
    items: library.items,
    groups: library.groups,
  })
  const recent = usePracticeLibrary(selectRecent('accompaniment'))
  const playing = chosen === 'chart' ? null : patternItemId(chosen)
  const items = arranged.items.map((item) =>
    item.id === playing && item.group === HIDDEN ? { ...item, group: item.home } : item,
  )
  const names = {
    [RECENT]: t('practice:library.recent'),
    [FAVOURITES]: t('common:library.favourites'),
    [MINE]: t('practice:library.mine'),
    [HIDDEN]: t('practice:library.hidden'),
  }
  const shown = libraryShown(items, view, {
    groups: arranged.groups,
    mine: library.mine,
    compare: new Intl.Collator(locale).compare,
    names,
    recent,
  })
  return { groups: arranged.groups, shown, patterns: library.patterns, names }
}
