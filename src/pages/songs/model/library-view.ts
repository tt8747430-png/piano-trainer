import { pieceStage } from '@/entities/course'
import type { FolderId, LibraryLayout, LibrarySort, ShelvedFolder } from '@/entities/library'
import { entryWords, type Entry, type PieceId } from '@/entities/piece'
import { STAGES, type Stage } from '@/entities/step'
import { matchesQuery, readChordList } from '@/shared/lib'
import { usesOnly } from './known-chords'
import type { SongsFilter } from './songs-filter'

/** Songs listed together: a folder's, or Home's; while the filters look through the library, named. */
export interface SongGroup {
  readonly key: string
  /** The folder's name over its songs while the filters look through the library at Home. */
  readonly heading: string | null
  readonly folder: FolderId | null
  readonly entries: readonly Entry[]
}

/** What a place of the library shows: its folders (Home's), its songs, how many the filters hide. */
export interface LibraryView {
  readonly folders: readonly ShelvedFolder[]
  readonly groups: readonly SongGroup[]
  /** Every song of the place, the filters aside: what Chords I know and Level offer. */
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

/** Whether a filter narrows anything. */
export const isFiltering = (filter: SongsFilter): boolean =>
  filter.q.trim() !== '' ||
  filter.withChords ||
  filter.stage !== 'any' ||
  filter.known !== '' ||
  filter.favourites

/** The songs in the order the sort says: as dragged, by title, or played last first (the rest after, as dragged). */
export function sortSongs(
  entries: readonly Entry[],
  sort: LibrarySort,
  { titleOf, opened, compare }: Pick<ViewLookups, 'titleOf' | 'opened' | 'compare'>,
): Entry[] {
  if (sort === 'name') return entries.toSorted((a, b) => compare(titleOf(a), titleOf(b)))
  if (sort === 'manual') return [...entries]
  const played = new Map(opened.map((id, index) => [id, index]))
  const rank = (entry: Entry) => played.get(entry.id) ?? Number.POSITIVE_INFINITY
  return entries.toSorted((a, b) => rank(a) - rank(b))
}

/**
 * A place of the library as the learner reads it (ADR 0106): at Home its folders, then its own songs;
 * in a folder its songs; each in the sort's order. While the filters narrow, at Home they look
 * through the whole library, the songs that match under their folders' names (Home's last), and the
 * folders whose names match the search; in a folder they narrow its songs.
 */
export function libraryView(
  layout: LibraryLayout,
  folder: FolderId | null,
  filter: SongsFilter,
  sort: LibrarySort,
  lookups: ViewLookups,
): LibraryView {
  const known = new Set(readChordList(filter.known))
  const keeps = (entry: Entry) =>
    (!filter.withChords || entry.kind !== 'listing') &&
    (filter.stage === 'any' || pieceStage(entry.id) === filter.stage) &&
    (known.size === 0 || usesOnly(entry, known)) &&
    (!filter.favourites || lookups.favourites.has(entry.id)) &&
    matchesQuery(entryWords(entry), filter.q)
  const entries = (ids: readonly PieceId[]) =>
    ids.flatMap((id) => {
      const entry = lookups.entryOf(id)
      return entry ? [entry] : []
    })
  const folders =
    sort === 'name'
      ? layout.folders.toSorted((a, b) =>
          lookups.compare(lookups.folderName(a), lookups.folderName(b)),
        )
      : layout.folders
  const lists =
    folder === null
      ? [
          ...folders.map((each) => ({ folder: each, songs: each.songs })),
          { folder: null, songs: layout.home },
        ]
      : folders
          .filter((each) => each.id === folder)
          .map((each) => ({ folder: each, songs: each.songs }))
  const filtering = isFiltering(filter)
  const atHome = folder === null
  // Home lists its own songs, and looks through every folder's while the filters narrow.
  const listed = atHome && !filtering ? lists.filter((list) => list.folder === null) : lists
  const named = atHome && filtering
  const groups = listed
    .map((list): SongGroup => ({
      key: list.folder?.id ?? 'home',
      heading: named ? (list.folder ? lookups.folderName(list.folder) : lookups.home) : null,
      folder: list.folder?.id ?? null,
      entries: sortSongs(entries(list.songs).filter(keeps), sort, lookups),
    }))
    .filter((group) => group.entries.length > 0 || !filtering)
  const scope = lists.flatMap((list) => entries(list.songs))
  const shown = groups.reduce((sum, group) => sum + group.entries.length, 0)
  const total = (atHome && !filtering ? entries(layout.home) : scope).length
  return {
    folders: atHome
      ? filtering
        ? folders.filter(
            (each) => filter.q.trim() !== '' && matchesQuery([lookups.folderName(each)], filter.q),
          )
        : folders
      : [],
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
