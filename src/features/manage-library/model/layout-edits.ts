import {
  arrangeLibrary,
  savedLayout,
  type FolderId,
  type LibraryCatalog,
  type LibraryLayout,
  type LibraryStore,
  type ShelvedEntry,
  type ShelvedFolder,
  type SongPlace,
} from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { mergeVisibleOrder } from '@/shared/lib'

/**
 * The library's edits, each over the whole layout as it stands (one snapshot, Mindscape's
 * `placeDecks`), so every song a batch moves lands where it should however many there are.
 */

/** A song's place after every other: where a song restored to its collection's folder stands. */
export const LAST = Number.MAX_SAFE_INTEGER

/** A song moved, and where it stood: what an Undo puts back. */
export interface Moved {
  readonly id: PieceId
  readonly from: SongPlace
}

/** Edits the library in its store: reads it over the catalog, changes it, saves what it is now. */
export function editLibrary(
  store: LibraryStore,
  catalog: LibraryCatalog,
  change: (layout: LibraryLayout) => LibraryLayout,
): void {
  const layout = arrangeLibrary(store.getState(), catalog)
  store.setState(savedLayout(change(layout)))
}

/** The layout with these songs taken out of wherever they stand: a folder, Home or the archive. */
export function without(layout: LibraryLayout, ids: ReadonlySet<PieceId>): LibraryLayout {
  const keep = (songs: readonly PieceId[]) => songs.filter((id) => !ids.has(id))
  return {
    folders: layout.folders.map((folder) => ({ ...folder, songs: keep(folder.songs) })),
    home: keep(layout.home),
    archive: layout.archive.flatMap((entry): ShelvedEntry[] => {
      if (entry.kind === 'song') return ids.has(entry.id) ? [] : [entry]
      return [{ ...entry, folder: { ...entry.folder, songs: keep(entry.folder.songs) } }]
    }),
  }
}

/** Every song a live list holds, where it stands. */
export function placesOf(layout: LibraryLayout, ids: readonly PieceId[]): Moved[] {
  const at = new Map<PieceId, SongPlace>()
  layout.home.forEach((id, index) => at.set(id, { folder: null, index }))
  for (const folder of layout.folders)
    folder.songs.forEach((id, index) => at.set(id, { folder: folder.id, index }))
  return ids.flatMap((id) => {
    const from = at.get(id)
    return from ? [{ id, from }] : []
  })
}

const insert = <T>(list: readonly T[], at: number, items: readonly T[]): T[] => [
  ...list.slice(0, at),
  ...items,
  ...list.slice(at),
]

/** Songs moved to the end of a folder or of Home (`null`): from a folder, Home or the archive. */
export function moveSongs(
  layout: LibraryLayout,
  ids: readonly PieceId[],
  to: FolderId | null,
): LibraryLayout {
  const moving = [...new Set(ids)]
  const rest = without(layout, new Set(moving))
  if (to === null) return { ...rest, home: [...rest.home, ...moving] }
  return {
    ...rest,
    folders: rest.folders.map((folder) =>
      folder.id === to ? { ...folder, songs: [...folder.songs, ...moving] } : folder,
    ),
  }
}

/**
 * Songs put back where each stood (an Undo, or a song's Restore): at its place in its folder while
 * that folder is in the library, else at Home, last.
 */
export function putBack(layout: LibraryLayout, moved: readonly Moved[]): LibraryLayout {
  const rest = without(layout, new Set(moved.map((each) => each.id)))
  const live = new Set(rest.folders.map((folder) => folder.id))
  const into = (folder: FolderId | null, songs: readonly PieceId[]): PieceId[] =>
    moved
      .filter((each) => each.from.folder === folder && (folder === null || live.has(folder)))
      .toSorted((a, b) => a.from.index - b.from.index)
      .reduce<PieceId[]>(
        (list, each) => insert(list, Math.min(each.from.index, list.length), [each.id]),
        [...songs],
      )
  const homeless = moved
    .filter((each) => each.from.folder !== null && !live.has(each.from.folder))
    .map((each) => each.id)
  return {
    ...rest,
    folders: rest.folders.map((folder) => ({ ...folder, songs: into(folder.id, folder.songs) })),
    home: [...into(null, rest.home), ...homeless],
  }
}

/** Songs out of the library into the archive, the newest first, each saying where it stood. */
export function archiveSongs(layout: LibraryLayout, ids: readonly PieceId[]): LibraryLayout {
  const moved = placesOf(layout, ids)
  const rest = without(layout, new Set(moved.map((each) => each.id)))
  const entries = moved.map((each): ShelvedEntry => ({ kind: 'song', ...each }))
  return { ...rest, archive: [...entries, ...rest.archive] }
}

/**
 * Archived songs back where they stood (`putBack`); one archived with its folder comes out of it
 * alone, at Home, last.
 */
export function restoreSongs(layout: LibraryLayout, ids: readonly PieceId[]): LibraryLayout {
  const wanted = new Set(ids)
  const moved = layout.archive.flatMap((entry): Moved[] =>
    entry.kind === 'song'
      ? wanted.has(entry.id)
        ? [{ id: entry.id, from: entry.from }]
        : []
      : entry.folder.songs
          .filter((id) => wanted.has(id))
          .map((id) => ({ id, from: { folder: entry.folder.id, index: LAST } })),
  )
  return putBack(layout, moved)
}

/** A folder, with its songs, out of the library into the archive, saying where it stood. */
export function archiveFolder(layout: LibraryLayout, id: FolderId): LibraryLayout {
  const index = layout.folders.findIndex((folder) => folder.id === id)
  const folder = layout.folders[index]
  if (!folder) return layout
  return {
    ...layout,
    folders: layout.folders.filter((each) => each.id !== id),
    archive: [{ kind: 'folder', folder, index }, ...layout.archive],
  }
}

/**
 * An archived folder back with its songs: at Home, last (Restore); or exactly where it stood
 * (`exact`: the toast's Undo).
 */
export function restoreFolder(layout: LibraryLayout, id: FolderId, exact = false): LibraryLayout {
  const entry = layout.archive.find((each) => each.kind === 'folder' && each.folder.id === id)
  if (entry?.kind !== 'folder') return layout
  const at = exact ? Math.min(entry.index, layout.folders.length) : layout.folders.length
  return {
    ...layout,
    folders: insert(layout.folders, at, [entry.folder]),
    archive: layout.archive.filter((each) => each !== entry),
  }
}

/** A folder made at Home, last, holding these songs (from wherever they stood). */
export function addFolder(
  layout: LibraryLayout,
  folder: ShelvedFolder,
  songs: readonly PieceId[] = [],
): LibraryLayout {
  const rest = without(layout, new Set(songs))
  return { ...rest, folders: [...rest.folders, { ...folder, songs: [...new Set(songs)] }] }
}

/** A folder changed where it stands, in the library or the archive. */
export function changeFolder(
  layout: LibraryLayout,
  id: FolderId,
  change: (folder: ShelvedFolder) => ShelvedFolder,
): LibraryLayout {
  return {
    ...layout,
    folders: layout.folders.map((folder) => (folder.id === id ? change(folder) : folder)),
    archive: layout.archive.map((entry) =>
      entry.kind === 'folder' && entry.folder.id === id
        ? { ...entry, folder: change(entry.folder) }
        : entry,
    ),
  }
}

/**
 * A folder deleted (the owner's rule, ADR 0106): what the learner made goes for good, what the app
 * brought to the archive. A built-in folder goes to the archive whole with the app's songs; an own
 * folder goes, the app's songs in it each to the archive, to be restored to its collection's folder.
 * The learner's own songs in it are named, for their caller to delete with their takes.
 */
export function dropFolder(
  layout: LibraryLayout,
  id: FolderId,
  catalog: LibraryCatalog,
): { layout: LibraryLayout; ownSongs: PieceId[] } {
  const own = new Set(catalog.ownSongs)
  const collectionOf = new Map(
    catalog.collections.flatMap((collection) =>
      collection.songs.map((song) => [song, collection.id] as const),
    ),
  )
  const live = layout.folders.findIndex((folder) => folder.id === id)
  const archived = layout.archive.findIndex(
    (entry) => entry.kind === 'folder' && entry.folder.id === id,
  )
  const entry = layout.archive[archived]
  const folder = layout.folders[live] ?? (entry?.kind === 'folder' ? entry.folder : undefined)
  if (!folder) return { layout, ownSongs: [] }
  const ownSongs = folder.songs.filter((song) => own.has(song))
  const appSongs = folder.songs.filter((song) => !own.has(song))
  const rest = without(layout, new Set(ownSongs))
  if (folder.builtIn) {
    const kept = { ...folder, songs: appSongs }
    return live >= 0
      ? {
          layout: archiveFolder(
            changeFolder(rest, id, () => kept),
            id,
          ),
          ownSongs,
        }
      : { layout: changeFolder(rest, id, () => kept), ownSongs }
  }
  const songs = appSongs.map((song): ShelvedEntry => ({
    kind: 'song',
    id: song,
    from: { folder: collectionOf.get(song) ?? null, index: LAST },
  }))
  const at = live >= 0 ? 0 : archived
  return {
    layout: {
      ...rest,
      folders: rest.folders.filter((each) => each.id !== id),
      archive: insert(
        rest.archive.filter((each) => each.kind !== 'folder' || each.folder.id !== id),
        at,
        songs,
      ),
    },
    ownSongs,
  }
}

/** Songs gone for good (the learner's own, deleted): out of every list. */
export const dropSongs = (layout: LibraryLayout, ids: readonly PieceId[]): LibraryLayout =>
  without(layout, new Set(ids))

/** The folders in the order dropped on screen: those shown take it in their places, the rest keep theirs. */
export function orderFolders(layout: LibraryLayout, order: readonly FolderId[]): LibraryLayout {
  const byId = new Map(layout.folders.map((folder) => [folder.id, folder]))
  const ids = mergeVisibleOrder(
    layout.folders.map((folder) => folder.id),
    order,
  )
  return { ...layout, folders: ids.flatMap((id) => byId.get(id) ?? []) }
}

/** A folder's songs, or Home's (`null`), in the order dropped on screen, as `orderFolders`. */
export function orderSongs(
  layout: LibraryLayout,
  folder: FolderId | null,
  order: readonly PieceId[],
): LibraryLayout {
  if (folder === null) return { ...layout, home: mergeVisibleOrder(layout.home, order) }
  return changeFolder(layout, folder, (each) => ({
    ...each,
    songs: mergeVisibleOrder(each.songs, order),
  }))
}
