import {
  arrangeLibrary,
  canMoveFolder,
  childFolders,
  savedLayout,
  subtreeIds,
  withoutDescendants,
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
 * `placeDecks`), so every song or folder a batch moves lands where it should however many there are.
 */

/** A song's place after every other: where a song restored to its collection's folder stands. */
export const LAST = Number.MAX_SAFE_INTEGER

/** A song moved, and where it stood: what an Undo puts back. */
export interface Moved {
  readonly id: PieceId
  readonly from: SongPlace
}

/** A folder moved, and where it stood: the folder it stood in and its place among those there. */
export interface FolderMoved {
  readonly id: FolderId
  readonly parent: FolderId | null
  readonly index: number
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

const insert = <T>(list: readonly T[], at: number, items: readonly T[]): T[] => [
  ...list.slice(0, at),
  ...items,
  ...list.slice(at),
]

const isLive = (layout: LibraryLayout, id: FolderId | null): boolean =>
  id === null || layout.folders.some((folder) => folder.id === id)

/**
 * Folders set in a place (`parent`) at a place among the folders there (`index`; past them, last).
 * The folders of one place stand in the order the list holds them, so each goes in before the one
 * now at its place, or after the last of them.
 */
function placeFolders(
  folders: readonly ShelvedFolder[],
  placing: readonly ShelvedFolder[],
  parent: FolderId | null,
  index = LAST,
): ShelvedFolder[] {
  const moving = new Set(placing.map((folder) => folder.id))
  const rest = folders.filter((folder) => !moving.has(folder.id))
  const there = childFolders(rest, parent)
  const before = there[index]
  const last = there.at(-1)
  const at = before ? rest.indexOf(before) : last ? rest.indexOf(last) + 1 : rest.length
  return insert(
    rest,
    at,
    placing.map((folder) => ({ ...folder, parent })),
  )
}

/** Where a folder stands: the folder it stands in, and its place among those there. */
function folderPlace(folders: readonly ShelvedFolder[], id: FolderId): FolderMoved | null {
  const folder = folders.find((each) => each.id === id)
  if (!folder) return null
  return { id, parent: folder.parent, index: childFolders(folders, folder.parent).indexOf(folder) }
}

/** The layout with these songs taken out of wherever they stand: a folder, Home or the archive. */
export function without(layout: LibraryLayout, ids: ReadonlySet<PieceId>): LibraryLayout {
  const keep = (songs: readonly PieceId[]) => songs.filter((id) => !ids.has(id))
  return {
    folders: layout.folders.map((folder) => ({ ...folder, songs: keep(folder.songs) })),
    home: keep(layout.home),
    archive: layout.archive.flatMap((entry): ShelvedEntry[] => {
      if (entry.kind === 'song') return ids.has(entry.id) ? [] : [entry]
      return [
        {
          ...entry,
          folder: { ...entry.folder, songs: keep(entry.folder.songs) },
          subfolders: entry.subfolders.map((each) => ({ ...each, songs: keep(each.songs) })),
        },
      ]
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

/**
 * The folders a move takes into a place, each where it stands now (what its Undo puts back): a
 * folder chosen under another chosen moves with it; none moves into itself or a folder under it,
 * nor where it already stands.
 */
export function folderPlacesOf(
  layout: LibraryLayout,
  ids: readonly FolderId[],
  to: FolderId | null,
): FolderMoved[] {
  if (!isLive(layout, to)) return []
  return withoutDescendants(layout.folders, ids)
    .filter((id) => canMoveFolder(layout.folders, id, to))
    .flatMap((id) => folderPlace(layout.folders, id) ?? [])
    .filter((place) => place.parent !== to)
}

/** Folders moved into a place (Home: `null`), last there, each with all it holds (`folderPlacesOf`). */
export function moveFolders(
  layout: LibraryLayout,
  ids: readonly FolderId[],
  to: FolderId | null,
): LibraryLayout {
  const moving = new Set(folderPlacesOf(layout, ids, to).map((place) => place.id))
  const folders = layout.folders.filter((folder) => moving.has(folder.id))
  return folders.length > 0
    ? { ...layout, folders: placeFolders(layout.folders, folders, to) }
    : layout
}

/** Folders put back exactly where each stood (a move's Undo); at Home where that folder is gone. */
export function putFoldersBack(
  layout: LibraryLayout,
  moved: readonly FolderMoved[],
): LibraryLayout {
  const folders = moved
    .toSorted((a, b) => a.index - b.index)
    .reduce<ShelvedFolder[]>(
      (list, place) => {
        const folder = list.find((each) => each.id === place.id)
        if (!folder) return list
        const kept = place.parent === null || list.some((each) => each.id === place.parent)
        const parent = kept && canMoveFolder(list, place.id, place.parent) ? place.parent : null
        return placeFolders(list, [folder], parent, parent === place.parent ? place.index : LAST)
      },
      [...layout.folders],
    )
  return { ...layout, folders }
}

/** Songs out of the library into the archive, the newest first, each saying where it stood. */
export function archiveSongs(layout: LibraryLayout, ids: readonly PieceId[]): LibraryLayout {
  const moved = placesOf(layout, ids)
  const rest = without(layout, new Set(moved.map((each) => each.id)))
  const entries = moved.map((each): ShelvedEntry => ({ kind: 'song', ...each }))
  return { ...rest, archive: [...entries, ...rest.archive] }
}

/**
 * Archived songs back where they stood (`putBack`); one archived with its folder (or a folder above
 * it) comes out of it alone, at Home, last.
 */
export function restoreSongs(layout: LibraryLayout, ids: readonly PieceId[]): LibraryLayout {
  const wanted = new Set(ids)
  const moved = layout.archive.flatMap((entry): Moved[] =>
    entry.kind === 'song'
      ? wanted.has(entry.id)
        ? [{ id: entry.id, from: entry.from }]
        : []
      : [entry.folder, ...entry.subfolders].flatMap((folder) =>
          folder.songs
            .filter((id) => wanted.has(id))
            .map((id) => ({ id, from: { folder: folder.id, index: LAST } })),
        ),
  )
  return putBack(layout, moved)
}

/**
 * A folder, with its songs and every folder under it, out of the library into the archive, saying
 * where it stood: the folder it stood in, and its place among those there.
 */
export function archiveFolder(layout: LibraryLayout, id: FolderId): LibraryLayout {
  const place = folderPlace(layout.folders, id)
  const folder = layout.folders.find((each) => each.id === id)
  if (!place || !folder) return layout
  const under = new Set(subtreeIds(layout.folders, id))
  const subfolders = layout.folders.filter((each) => each.id !== id && under.has(each.id))
  return {
    ...layout,
    folders: layout.folders.filter((each) => !under.has(each.id)),
    archive: [{ kind: 'folder', folder, subfolders, index: place.index }, ...layout.archive],
  }
}

/**
 * An archived folder back with its songs and the folders under it: in the folder it stood in while
 * that is in the library, else at Home, last there (Restore); or exactly where it stood (`exact`:
 * the toast's Undo).
 */
export function restoreFolder(layout: LibraryLayout, id: FolderId, exact = false): LibraryLayout {
  const entry = layout.archive.find((each) => each.kind === 'folder' && each.folder.id === id)
  if (entry?.kind !== 'folder') return layout
  const parent = isLive(layout, entry.folder.parent) ? entry.folder.parent : null
  const index = exact && parent === entry.folder.parent ? entry.index : LAST
  return {
    ...layout,
    folders: [...placeFolders(layout.folders, [entry.folder], parent, index), ...entry.subfolders],
    archive: layout.archive.filter((each) => each !== entry),
  }
}

/** A folder made in its place (its `parent`; Home where that is gone), last there, holding these songs. */
export function addFolder(
  layout: LibraryLayout,
  folder: ShelvedFolder,
  songs: readonly PieceId[] = [],
): LibraryLayout {
  const rest = without(layout, new Set(songs))
  const made = { ...folder, songs: [...new Set(songs)] }
  const parent = isLive(rest, folder.parent) ? folder.parent : null
  return { ...rest, folders: placeFolders(rest.folders, [made], parent) }
}

/** A folder changed where it stands, in the library or the archive. */
export function changeFolder(
  layout: LibraryLayout,
  id: FolderId,
  change: (folder: ShelvedFolder) => ShelvedFolder,
): LibraryLayout {
  const each = (folder: ShelvedFolder) => (folder.id === id ? change(folder) : folder)
  return {
    ...layout,
    folders: layout.folders.map(each),
    archive: layout.archive.map((entry) =>
      entry.kind === 'folder'
        ? { ...entry, folder: each(entry.folder), subfolders: entry.subfolders.map(each) }
        : entry,
    ),
  }
}

/**
 * A folder deleted with every folder under it (the owner's rule, ADR 0106), each by the same rule:
 * what the learner made goes for good, what the app brought to the archive. A built-in folder goes
 * to the archive whole with the app's songs in it (Restore puts it at Home); an own folder goes, the
 * app's songs in it each to the archive, to be restored to its collection's folder. The learner's own
 * songs in any of them are named, for their caller to delete with their takes.
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
  const archivedAt = layout.archive.findIndex(
    (entry) => entry.kind === 'folder' && entry.folder.id === id,
  )
  const entry = layout.archive[archivedAt]
  const under = new Set(subtreeIds(layout.folders, id))
  const dropping =
    entry?.kind === 'folder'
      ? [entry.folder, ...entry.subfolders]
      : layout.folders.filter((folder) => under.has(folder.id))
  if (dropping.length === 0) return { layout, ownSongs: [] }
  const ownSongs = dropping.flatMap((folder) => folder.songs.filter((song) => own.has(song)))
  const kept = dropping.flatMap((folder): ShelvedEntry[] => {
    const songs = folder.songs.filter((song) => !own.has(song))
    if (folder.builtIn)
      return [
        {
          kind: 'folder',
          folder: { ...folder, parent: null, songs },
          subfolders: [],
          index: LAST,
        },
      ]
    return songs.map((song) => ({
      kind: 'song',
      id: song,
      from: { folder: collectionOf.get(song) ?? null, index: LAST },
    }))
  })
  const gone = new Set(dropping.map((folder) => folder.id))
  const rest = without(layout, new Set(ownSongs))
  const archive = rest.archive.filter((each) => each.kind !== 'folder' || !gone.has(each.folder.id))
  return {
    layout: {
      ...rest,
      folders: rest.folders.filter((folder) => !gone.has(folder.id)),
      archive: insert(archive, entry ? archivedAt : 0, kept),
    },
    ownSongs,
  }
}

/** Songs gone for good (the learner's own, deleted): out of every list. */
export const dropSongs = (layout: LibraryLayout, ids: readonly PieceId[]): LibraryLayout =>
  without(layout, new Set(ids))

/**
 * The folders of one place in the order dropped on screen: those shown take it in their places, the
 * rest (another place's, or hidden) keep theirs.
 */
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
