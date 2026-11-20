import { STAGES, type Stage } from '@/entities/step'
import {
  ALL,
  FAVOURITES,
  RECENT,
  type LibraryItem,
  type LibraryShown,
  type PracticeLibraryView,
} from '@/widgets/practice-library'

/** What the Pattern sheet opens on: every pattern, in its books' order, nothing searched. */
export const PATTERN_VIEW: PracticeLibraryView = {
  q: '',
  sort: 'group',
  place: ALL,
  stage: 'any',
  mode: 'any',
}

/** A fold's picture: Recently used's clock, Favourites' heart, a book's, or a plain list. */
export type FoldIcon = 'recent' | 'favourites' | 'book' | 'list'

/** A run of rows under a sub-heading inside a fold (a method book's group); untitled, the fold's own. */
interface FoldPart {
  readonly title: string | null
  readonly rows: readonly LibraryItem[]
}

/** A fold of the Pattern sheet: its heading's picture, name and count, and its rows in their parts. */
export interface PatternFold {
  readonly id: string
  readonly title: string
  readonly icon: FoldIcon
  readonly count: number
  readonly parts: readonly FoldPart[]
}

/** The rows in their runs, by the run each names (a method book's group); in the order first met. */
const partsBy = (
  rows: readonly LibraryItem[],
  partOf: (item: LibraryItem) => string | null,
): FoldPart[] => {
  const parts = new Map<string | null, LibraryItem[]>()
  for (const row of rows) {
    const title = partOf(row)
    parts.set(title, [...(parts.get(title) ?? []), row])
  }
  return [...parts].map(([title, each]) => ({ title, rows: each }))
}

/**
 * The Pattern sheet's folds (the PlayerApp board's `patItems`): by book, the library's own runs
 * (Recently used and Favourites first while nothing narrows, then each book, Mine last), a method
 * book's rows under its groups' names (`partOf`); by name, one run A–Z; by level, a run each level,
 * the ungraded last. None empty.
 */
export function patternFolds(
  shown: LibraryShown,
  sort: PracticeLibraryView['sort'],
  {
    names,
    partOf,
  }: {
    /** A–Z, Not graded and each level's names. */
    names: { readonly az: string; readonly ungraded: string; stage(stage: Stage): string }
    /** A row's sub-heading in its book's fold, or none. */
    partOf: (item: LibraryItem) => string | null
  },
): PatternFold[] {
  const fold = (
    id: string,
    title: string,
    icon: FoldIcon,
    parts: readonly FoldPart[],
  ): PatternFold => ({
    id,
    title,
    icon,
    count: parts.reduce((total, part) => total + part.rows.length, 0),
    parts,
  })
  if (sort === 'name')
    return shown.items.length > 0
      ? [fold('az', names.az, 'list', [{ title: null, rows: shown.items }])]
      : []
  if (sort === 'level')
    return [...STAGES, null]
      .map((stage) =>
        fold(stage ?? 'ungraded', stage ? names.stage(stage) : names.ungraded, 'list', [
          { title: null, rows: shown.items.filter((item) => (item.stage ?? null) === stage) },
        ]),
      )
      .filter((each) => each.count > 0)
  return shown.sections.map((section) =>
    section.id === RECENT || section.id === FAVOURITES
      ? fold(section.id, section.name, section.id === RECENT ? 'recent' : 'favourites', [
          { title: null, rows: section.items },
        ])
      : fold(section.id, section.name, 'book', partsBy(section.items, partOf)),
  )
}

/**
 * Whether a fold opens of itself: while anything narrows or sorts the list, every one; else
 * Recently used and Favourites, the books closed.
 */
export const foldsOpen = (narrowed: boolean, id: string): boolean =>
  narrowed || id === RECENT || id === FAVOURITES
