import type { LucideIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { stageRank, type Stage } from '@/entities/step'
import { matchesQuery } from '@/shared/lib'
import type { Paint, RowAction } from '@/shared/ui'
import type { GroupWord } from './library-words'

/** How a practice library sorts: its books' (or styles') own order, by name, or by level. */
export const PRACTICE_SORTS = ['group', 'name', 'level'] as const
export type PracticeSort = (typeof PRACTICE_SORTS)[number]

/** The places of a library's tree that every library has, beside its books (or styles). */
export const ALL = 'all'
export const FAVOURITES = 'favourites'
/** What the learner made (own patterns, own progressions). */
export const MINE = 'mine'
/** Accompaniment's built-in patterns the learner hid, while there are some. */
export const HIDDEN = 'hidden'

/**
 * A practice library's URL (R30-4, as Songs' library holds its filters): what is searched, the sort,
 * the place open in its tree (All, Favourites, a book or a style, Mine), and the one level shown.
 */
export interface PracticeLibraryView {
  readonly q: string
  readonly sort: PracticeSort
  readonly place: string
  readonly stage: Stage | 'any'
}

/**
 * A book of a library (Barry Harris, Called to Play), a style (Pop) or the learner's folder: a place
 * of its tree.
 */
export interface LibraryGroup {
  readonly id: string
  readonly name: string
  /** Where the rest of a book's material is (R32): its course in Learn, its songs in Songs. */
  readonly links?: ReactNode
}

/** A run of rows on a phone: a book's, or a book's songs apart from its patterns. */
export interface LibrarySection {
  readonly id: string
  readonly name: string
}

/**
 * A row's picture: its kind's icon on a painted tile, or a progression's chords as tiles tinted by
 * role (R34), under its name on a phone and in the table's column for them.
 */
/** A row's picture: its book's or kind's icon, or a few words of its music (a progression's first numerals). */
export type LibraryPicture =
  | { readonly icon: LucideIcon; readonly paint: Paint }
  | { readonly text: string; readonly paint: Paint }

/** One row of a practice library: an exercise, a pattern, a study, a progression. */
export interface LibraryItem {
  /** Unique in its library. */
  readonly id: string
  readonly name: string
  /** Its line under its name. */
  readonly detail: string
  /** Its place in the tree: a book's or a style's id, `mine` or `hidden`. */
  readonly group: string
  /** Its run on a phone where its book has more than one (Called to Play's songs); its group's else. */
  readonly section?: LibrarySection
  /** Its level, where its content has one. */
  readonly stage?: Stage
  /** The table's extra column (an accompaniment's hands, a progression's numerals). */
  readonly extra?: string
  /** Words a search finds it by besides its name and lines. */
  readonly words?: readonly string[]
  readonly picture: LibraryPicture
  /** Its page: a router `Link`. */
  readonly link: ReactElement
  readonly favourite: boolean
  /** Its More and its swipe: Favourite first. */
  readonly actions: readonly RowAction[]
  /** What it carries at its end before its level (an exercise done today). */
  readonly trailing?: ReactNode
  /**
   * Its own hiding, where its page keeps one (a pattern, which the Player's picker leaves out too);
   * else the library's arrangement hides it.
   */
  readonly hide?: { readonly hidden: boolean; toggle(): void }
}

/** A run of rows on a phone, as it shows: its rows, and how many it holds. */
export interface ShownSection extends LibrarySection {
  readonly items: readonly LibraryItem[]
}

/** What a library shows for its URL. */
export interface LibraryShown {
  /** The place open, read: an unknown one is All. */
  readonly place: string
  /** The rows the place, the search and the level keep, in the sort's order. */
  readonly items: readonly LibraryItem[]
  /** A phone's runs: Favourites first at All while nothing narrows, then each book's, Mine last. */
  readonly sections: readonly ShownSection[]
  /** How many rows each place holds, the search and level aside. */
  readonly counts: Readonly<Record<string, number>>
  /** Whether the search or the level narrows what the place holds. */
  readonly filtering: boolean
  /** How many rows the place holds, the search and level aside. */
  readonly scope: number
  /** The levels the place holds, in order. */
  readonly stages: readonly Stage[]
}

/** The places a library has: its groups, then Mine and Hidden where it has them. */
export const placesOf = (groups: readonly LibraryGroup[], mine: boolean): string[] => [
  ...groups.map((group) => group.id),
  ...(mine ? [MINE] : []),
  HIDDEN,
]

/**
 * A practice library as its URL shows it (R30-4): the place's rows (All, Favourites, a book, Mine)
 * narrowed by the search and the level, in the sort's order; on a phone, the runs they fall in, each
 * book's in its order with Mine and Hidden last, and at All with nothing narrowing, Favourites first.
 */
export function libraryShown(
  items: readonly LibraryItem[],
  view: PracticeLibraryView,
  {
    groups,
    mine,
    compare,
    names,
  }: {
    groups: readonly LibraryGroup[]
    mine: boolean
    compare: (a: string, b: string) => number
    /** The runs' names: Favourites, Mine, Hidden. */
    names: Readonly<Record<typeof FAVOURITES | typeof MINE | typeof HIDDEN, string>>
  },
): LibraryShown {
  const places = placesOf(groups, mine)
  const place = view.place === FAVOURITES || places.includes(view.place) ? view.place : ALL
  const inPlace = (item: LibraryItem) =>
    place === ALL
      ? item.group !== HIDDEN
      : place === FAVOURITES
        ? item.favourite
        : item.group === place
  const scoped = items.filter(inPlace)
  const keeps = (item: LibraryItem) =>
    (view.stage === 'any' || item.stage === view.stage) &&
    matchesQuery([item.name, item.detail, item.extra ?? '', ...(item.words ?? [])], view.q)
  const order = new Map(places.map((id, at) => [id, at]))
  const groupAt = (item: LibraryItem) => order.get(item.group) ?? places.length
  const sorted = (list: readonly LibraryItem[]): LibraryItem[] => {
    if (view.sort === 'name') return list.toSorted((a, b) => compare(a.name, b.name))
    if (view.sort === 'level')
      return list.toSorted(
        (a, b) =>
          (a.stage ? stageRank(a.stage) : 5) - (b.stage ? stageRank(b.stage) : 5) ||
          compare(a.name, b.name),
      )
    return list.toSorted((a, b) => groupAt(a) - groupAt(b))
  }
  const shown = sorted(scoped.filter(keeps))
  const filtering = view.q.trim() !== '' || view.stage !== 'any'
  const counts: Record<string, number> = {
    [ALL]: items.filter((item) => item.group !== HIDDEN).length,
    [FAVOURITES]: items.filter((item) => item.favourite).length,
  }
  for (const item of items) counts[item.group] = (counts[item.group] ?? 0) + 1
  const sectionOf = (item: LibraryItem): LibrarySection =>
    item.section ?? {
      id: item.group,
      name:
        item.group === MINE || item.group === HIDDEN
          ? names[item.group]
          : (groups.find((group) => group.id === item.group)?.name ?? item.group),
    }
  // The runs in their books' order, each in the order its first row comes in the catalog.
  const runs = new Map<string, { section: LibrarySection; at: number; items: LibraryItem[] }>()
  items.forEach((item, at) => {
    const section = sectionOf(item)
    if (!runs.has(section.id)) runs.set(section.id, { section, at, items: [] })
  })
  for (const item of shown) runs.get(sectionOf(item).id)?.items.push(item)
  const byBook = [...runs.values()]
    .filter((run) => run.items.length > 0)
    .toSorted(
      (a, b) =>
        (order.get(a.items[0]?.group ?? '') ?? places.length) -
          (order.get(b.items[0]?.group ?? '') ?? places.length) || a.at - b.at,
    )
    .map(({ section, items: rows }) => ({ ...section, items: rows }))
  const favourites = shown.filter((item) => item.favourite)
  const sections: ShownSection[] =
    place === FAVOURITES
      ? shown.length > 0
        ? [{ id: FAVOURITES, name: names[FAVOURITES], items: shown }]
        : []
      : place === ALL && !filtering && favourites.length > 0
        ? [{ id: FAVOURITES, name: names[FAVOURITES], items: favourites }, ...byBook]
        : byBook
  const stages = [...new Set(scoped.flatMap((item) => (item.stage ? [item.stage] : [])))].toSorted(
    (a, b) => stageRank(a) - stageRank(b),
  )
  return { place, items: shown, sections, counts, filtering, scope: scoped.length, stages }
}

/** How many filters are on: the level, and for a library of styles the style (its tree's place). */
export const libraryFiltersOn = (
  view: PracticeLibraryView,
  groups: readonly LibraryGroup[],
  groupWord: GroupWord,
): number =>
  Number(view.stage !== 'any') +
  Number(groupWord === 'style' && groups.some((group) => group.id === view.place))
