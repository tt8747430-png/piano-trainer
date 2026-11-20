import {
  childFolders,
  folderPath,
  subtreeIds,
  type FolderId,
  type LibraryLayout,
  type LibrarySort,
  type SortDirection,
  type ShelvedFolder,
} from '@/entities/library'
import { entryAuthor, entryWords, type Entry, type PieceId } from '@/entities/piece'
import { matchesQuery } from '@/shared/lib'
import type { SongsFilter } from './songs-filter'

/** Songs listed together: a folder's, or Home's; while the filters look through folders, named. */
export interface SongGroup {
  readonly key: string
  /** The folder's path from the place open (`A › B`), while the filters look through its folders. */
  readonly heading: string | null
  readonly folder: FolderId | null
  readonly entries: readonly Entry[]
}

/** A folder as a row shows it: the folders and songs in it counted, and how many of its songs are learned. */
export interface FolderView {
  readonly folder: ShelvedFolder
  readonly folders: number
  readonly songs: number
  readonly learned: number
}

/** What a place of the library shows: its folders, its songs, how many the filters hide. */
export interface LibraryView {
  readonly folders: readonly FolderView[]
  /** The place itself, a folder counted as its row shows it: its head (canvas 133); none at Home. */
  readonly here: FolderView | null
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
  /** The songs the learner has learned. */
  readonly learned: ReadonlySet<PieceId>
  /** The songs played, the latest first. */
  readonly opened: readonly PieceId[]
  readonly compare: (a: string, b: string) => number
  /** Home's name, over its songs while the filters look through the library. */
  readonly home: string
  /** Every song's heading at Home, under the folders: Songs, as the laptop's table and the boards name it. */
  readonly allSongs: string
  /** When an own song came into the library, ISO; null for the app's songs. */
  readonly addedOf: (id: PieceId) => string | null
  /** What a search also finds a song by in the learner's library: its tags and its genre's name. */
  readonly detailWords: (id: PieceId) => readonly string[]
}

/** Whether the search narrows anything: the library's one filter (R72). */
export const isFiltering = (filter: SongsFilter): boolean => filter.q.trim() !== ''

/**
 * The songs in the order the sort says, the way it runs (R72, Flat's library): by when each was played
 * last, by title, by who wrote it, or by when it came in. What has no date or composer stands after the
 * rest either way, as the library holds it.
 */
export function sortSongs(
  entries: readonly Entry[],
  sort: LibrarySort,
  direction: SortDirection,
  {
    titleOf,
    opened,
    compare,
    addedOf,
  }: Pick<ViewLookups, 'titleOf' | 'opened' | 'compare' | 'addedOf'>,
): Entry[] {
  const way = direction === 'ascending' ? 1 : -1
  const byTitle = (a: Entry, b: Entry) => compare(titleOf(a), titleOf(b))
  if (sort === 'title') return entries.toSorted((a, b) => way * byTitle(a, b))
  if (sort === 'composer') {
    const by = (entry: Entry) => entryAuthor(entry) ?? ''
    return entries.toSorted(
      (a, b) =>
        Number(by(a) === '') - Number(by(b) === '') || way * compare(by(a), by(b)) || byTitle(a, b),
    )
  }
  // Played: `opened` is the latest first, so its place is newest first. Added: own songs' dates.
  const played = new Map(opened.map((id, index) => [id, -index]))
  const when = (entry: Entry): number | null =>
    sort === 'played'
      ? (played.get(entry.id) ?? null)
      : ((date) => (date === null ? null : Date.parse(date)))(addedOf(entry.id))
  return entries.toSorted((a, b) => {
    const x = when(a)
    const y = when(b)
    if (x === null || y === null) return Number(x === null) - Number(y === null)
    return way * (x - y)
  })
}

/**
 * A place of the library as the learner reads it (ADR 0106): Home or a folder, its folders first,
 * then its own songs, each in the sort's order. While the filters narrow, they look through all the
 * place holds, its folders' folders too: the songs that match under their folders' paths from it
 * (its own last, under its name), and the folders whose names match the search.
 *
 * Beside the library's tree (`tree`, a laptop's two panes) the place's folders head its table as on a
 * phone (the SongsLaptop board's Folders), then Home lists every song in one list (Home's own first,
 * then the folders'), a folder its own songs, each narrowed by the filters in one list.
 */
export function libraryView(
  layout: LibraryLayout,
  place: FolderId | null,
  filter: SongsFilter,
  sort: LibrarySort,
  direction: SortDirection,
  lookups: ViewLookups,
  {
    tree = false,
    everySong = false,
    favouritesOnly = false,
  }: {
    tree?: boolean
    /** At Home, every song under the folders as one list, Songs (a phone's Home). */
    everySong?: boolean
    /** Only the learner's favourites: My songs' Favourites card (R72). */
    favouritesOnly?: boolean
  } = {},
): LibraryView {
  const keeps = (entry: Entry) =>
    (!favouritesOnly || lookups.favourites.has(entry.id)) &&
    matchesQuery([...entryWords(entry), ...lookups.detailWords(entry.id)], filter.q)
  const entries = (ids: readonly PieceId[]) =>
    ids.flatMap((id) => {
      const entry = lookups.entryOf(id)
      return entry ? [entry] : []
    })
  const byName = (folders: readonly ShelvedFolder[]) =>
    sort === 'title'
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

  const all = everySong && place === null && !filtering && !tree
  const lists = all
    ? [
        {
          folder: null,
          heading: lookups.allSongs,
          songs: [...own, ...nested.flatMap((f) => f.songs)],
        },
      ]
    : tree
      ? [
          {
            folder: here ?? null,
            heading: null,
            songs: place === null ? [...own, ...nested.flatMap((folder) => folder.songs)] : own,
          },
        ]
      : filtering
        ? [
            ...nested.map((folder) => ({ folder, heading: pathOf(folder), songs: folder.songs })),
            {
              folder: here ?? null,
              heading: here ? lookups.folderName(here) : lookups.home,
              songs: own,
            },
          ]
        : [{ folder: here ?? null, heading: null, songs: own }]
  const named = all || (!tree && filtering && nested.length > 0)
  const groups = lists
    .map((list): SongGroup => ({
      key: all ? 'all' : (list.folder?.id ?? 'home'),
      heading: named ? list.heading : null,
      folder: list.folder?.id ?? null,
      entries: sortSongs(entries(list.songs).filter(keeps), sort, direction, lookups),
    }))
    .filter((group) => group.entries.length > 0 || !filtering || tree)
  const scope =
    tree && place !== null
      ? entries(own)
      : [...nested.flatMap((folder) => entries(folder.songs)), ...entries(own)]
  const shown = groups.reduce((sum, group) => sum + group.entries.length, 0)
  const total = filtering || tree ? scope.length : entries(own).length
  const folderView = (folder: ShelvedFolder): FolderView => ({
    folder,
    folders: childFolders(layout.folders, folder.id).length,
    songs: folder.songs.length,
    learned: folder.songs.filter((id) => lookups.learned.has(id)).length,
  })
  const searched = filter.q.trim() !== ''
  return {
    folders: (tree
      ? []
      : filtering
        ? searched
          ? byName(nested).filter((folder) => matchesQuery([lookups.folderName(folder)], filter.q))
          : []
        : byName(childFolders(layout.folders, place))
    ).map(folderView),
    here: ((folder) => (folder ? folderView(folder) : null))(
      place === null ? undefined : layout.folders.find((each) => each.id === place),
    ),
    groups,
    scope,
    shown,
    hidden: filtering ? total - shown : 0,
    filtering,
  }
}
