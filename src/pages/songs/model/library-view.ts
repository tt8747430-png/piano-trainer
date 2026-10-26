import { pieceStage } from '@/entities/course'
import {
  childFolders,
  folderPath,
  subtreeIds,
  type FolderId,
  type LibraryLayout,
  type LibrarySort,
  type ShelvedFolder,
} from '@/entities/library'
import { entryWords, pieceKey, type Entry, type PieceId } from '@/entities/piece'
import { STAGES, type Stage } from '@/entities/step'
import { matchesQuery } from '@/shared/lib'
import { keyFromParam, keyParam, pitchClassOf, type KeyParam } from '@/shared/lib/music'
import type { SongsFilter } from './songs-filter'

/** Songs listed together: a folder's, or Home's; while the filters look through folders, named. */
export interface SongGroup {
  readonly key: string
  /** The folder's path from the place open (`A › B`), while the filters look through its folders. */
  readonly heading: string | null
  readonly folder: FolderId | null
  readonly entries: readonly Entry[]
}

/** A folder as a row shows it: its songs and the folders in it counted, and its first songs' titles. */
export interface FolderView {
  readonly folder: ShelvedFolder
  readonly folders: number
  readonly songs: number
  /** The titles of its first few songs, as it lists them. */
  readonly first: readonly string[]
}

/** What a place of the library shows: its folders, its songs, how many the filters hide. */
export interface LibraryView {
  readonly folders: readonly FolderView[]
  readonly groups: readonly SongGroup[]
  /** Every song the place holds, in it and in its folders, the filters aside: what Level and Key offer. */
  readonly scope: readonly Entry[]
  readonly shown: number
  readonly hidden: number
  readonly filtering: boolean
}

/** What the view reads beside the layout: each song's entry and title, each folder's name, the learner's marks. */
export interface ViewLookups {
  readonly entryOf: (id: PieceId) => Entry | undefined
  readonly titleOf: (entry: Entry) => string
  readonly folderName: (folder: ShelvedFolder) => string
  readonly favourites: ReadonlySet<PieceId>
  /** The songs played, the latest first. */
  readonly opened: readonly PieceId[]
  readonly compare: (a: string, b: string) => number
  /** Home's name, over its songs while the filters look through the library. */
  readonly home: string
}

/** How many first songs a folder's row names. */
const FIRST_TITLES = 3

/** The filters that narrow, besides the search: what the Filter button counts and its chips name. */
export const filtersOn = (filter: SongsFilter): number =>
  Number(filter.stage !== 'any') + Number(filter.key !== '') + Number(filter.favourites)

/** Whether a filter narrows anything. */
export const isFiltering = (filter: SongsFilter): boolean =>
  filter.q.trim() !== '' || filtersOn(filter) > 0

/** A song's key as the URL writes it, and as the Key filter and sort read it. */
export const songKeyParam = (entry: Entry): KeyParam => keyParam(pieceKey(entry))

/** Keys in the order the Key sort and filter list them: the majors from C up, then the minors. */
export function compareKeys(a: KeyParam, b: KeyParam): number {
  const [one, two] = [keyFromParam(a), keyFromParam(b)]
  return (
    Number(one.minor) - Number(two.minor) ||
    pitchClassOf(one.tonic) - pitchClassOf(two.tonic) ||
    a.localeCompare(b, 'en')
  )
}

/**
 * The songs in the order the sort says: as dragged, by title, by key (then title), or played last
 * first (the rest after, as dragged).
 */
export function sortSongs(
  entries: readonly Entry[],
  sort: LibrarySort,
  { titleOf, opened, compare }: Pick<ViewLookups, 'titleOf' | 'opened' | 'compare'>,
): Entry[] {
  if (sort === 'manual') return [...entries]
  const byTitle = (a: Entry, b: Entry) => compare(titleOf(a), titleOf(b))
  if (sort === 'name') return entries.toSorted(byTitle)
  if (sort === 'key')
    return entries.toSorted(
      (a, b) => compareKeys(songKeyParam(a), songKeyParam(b)) || byTitle(a, b),
    )
  const played = new Map(opened.map((id, index) => [id, index]))
  const rank = (entry: Entry) => played.get(entry.id) ?? Number.POSITIVE_INFINITY
  return entries.toSorted((a, b) => rank(a) - rank(b))
}

/**
 * A place of the library as the learner reads it (ADR 0106): Home or a folder, its folders first,
 * then its own songs, each in the sort's order. While the filters narrow, they look through all the
 * place holds, its folders' folders too: the songs that match under their folders' paths from it
 * (its own last, under its name), and the folders whose names match the search.
 */
export function libraryView(
  layout: LibraryLayout,
  place: FolderId | null,
  filter: SongsFilter,
  sort: LibrarySort,
  lookups: ViewLookups,
): LibraryView {
  const keeps = (entry: Entry) =>
    (filter.stage === 'any' || pieceStage(entry.id) === filter.stage) &&
    (filter.key === '' || songKeyParam(entry) === filter.key) &&
    (!filter.favourites || lookups.favourites.has(entry.id)) &&
    matchesQuery(entryWords(entry), filter.q)
  const entries = (ids: readonly PieceId[]) =>
    ids.flatMap((id) => {
      const entry = lookups.entryOf(id)
      return entry ? [entry] : []
    })
  const byName = (folders: readonly ShelvedFolder[]) =>
    sort === 'name'
      ? folders.toSorted((a, b) => lookups.compare(lookups.folderName(a), lookups.folderName(b)))
      : folders
  const here = place === null ? null : layout.folders.find((folder) => folder.id === place)
  const own = place === null ? layout.home : (here?.songs ?? [])
  // Every folder under the place, in the tree's order: the place's first, each followed by its own.
  const under =
    place === null
      ? layout.folders.flatMap((folder) =>
          folder.parent === null ? subtreeIds(layout.folders, folder.id) : [],
        )
      : subtreeIds(layout.folders, place).slice(1)
  const byId = new Map(layout.folders.map((folder) => [folder.id, folder]))
  const nested = under.flatMap((id) => byId.get(id) ?? [])
  const filtering = isFiltering(filter)
  const pathOf = (folder: ShelvedFolder) =>
    folderPath(layout.folders, folder.id)
      .slice(place === null ? 0 : folderPath(layout.folders, place).length)
      .map(lookups.folderName)
      .join(' › ')

  const lists = filtering
    ? [
        ...nested.map((folder) => ({ folder, heading: pathOf(folder), songs: folder.songs })),
        {
          folder: here ?? null,
          heading: here ? lookups.folderName(here) : lookups.home,
          songs: own,
        },
      ]
    : [{ folder: here ?? null, heading: null, songs: own }]
  const named = filtering && nested.length > 0
  const groups = lists
    .map((list): SongGroup => ({
      key: list.folder?.id ?? 'home',
      heading: named ? list.heading : null,
      folder: list.folder?.id ?? null,
      entries: sortSongs(entries(list.songs).filter(keeps), sort, lookups),
    }))
    .filter((group) => group.entries.length > 0 || !filtering)
  const scope = [...nested.flatMap((folder) => entries(folder.songs)), ...entries(own)]
  const shown = groups.reduce((sum, group) => sum + group.entries.length, 0)
  const total = filtering ? scope.length : entries(own).length
  const folderView = (folder: ShelvedFolder): FolderView => ({
    folder,
    folders: childFolders(layout.folders, folder.id).length,
    songs: folder.songs.length,
    first: entries(folder.songs.slice(0, FIRST_TITLES)).map(lookups.titleOf),
  })
  const searched = filter.q.trim() !== ''
  return {
    folders: (filtering
      ? searched
        ? byName(nested).filter((folder) => matchesQuery([lookups.folderName(folder)], filter.q))
        : []
      : byName(childFolders(layout.folders, place))
    ).map(folderView),
    groups,
    scope,
    shown,
    hidden: filtering ? total - shown : 0,
    filtering,
  }
}

/**
 * The levels the songs hold, in order, whatever is searched or chosen (so the choice stays put while
 * a search is typed): a level no song holds is never offered.
 */
export function stagesIn(entries: readonly Entry[]): Stage[] {
  const held = new Set(entries.map((entry) => pieceStage(entry.id)))
  return STAGES.filter((stage) => held.has(stage))
}

/** The keys the songs are written in, each with how many: the majors from C up, then the minors. */
export function keysIn(entries: readonly Entry[]): { key: KeyParam; count: number }[] {
  const counts = new Map<KeyParam, number>()
  for (const entry of entries) {
    const key = songKeyParam(entry)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts]
    .map(([key, count]) => ({ key, count }))
    .toSorted((a, b) => compareKeys(a.key, b.key))
}
