import type { PieceId, SongCollectionId } from '@/entities/piece'
import type { LibraryState } from './store'
import {
  COLLECTION_LOOKS,
  isOwnFolderId,
  type ArchiveEntry,
  type SavedFolder,
  type SongPlace,
} from './types'
import { reachableFolders } from './tree'

/** What the library is read over: the collections' songs in catalog order, and the learner's own songs. */
export interface LibraryCatalog {
  readonly collections: readonly {
    readonly id: SongCollectionId
    readonly songs: readonly PieceId[]
  }[]
  readonly ownSongs: readonly PieceId[]
}

/** A folder as the library shows it: as saved, its songs every one it holds, and whether it is the app's. */
export interface ShelvedFolder extends Omit<SavedFolder, 'songs'> {
  readonly builtIn: boolean
  readonly songs: readonly PieceId[]
}

/** A folder being shelved: its songs still taking those placed nowhere. */
type Shelving = ShelvedFolder & { songs: PieceId[] }

export type ShelvedEntry =
  | { readonly kind: 'song'; readonly id: PieceId; readonly from: SongPlace }
  | {
      readonly kind: 'folder'
      readonly folder: ShelvedFolder
      readonly subfolders: readonly ShelvedFolder[]
      readonly index: number
    }

/**
 * The whole library as it stands: its folders, each in the folder it stands in (those of one place
 * in their order), Home's songs, the archive newest first.
 */
export interface LibraryLayout {
  readonly folders: readonly ShelvedFolder[]
  readonly home: readonly PieceId[]
  readonly archive: readonly ShelvedEntry[]
}

/**
 * The library read over the catalog (ADR 0106, Mindscape's `library-arrangement`, folders in
 * folders), writing nothing: what the store holds stands where it put it, each song once and only
 * one the repertoire has; a folder whose folder is gone, or archived, or whose links loop stands at
 * Home (`reachableFolders`), as does a built-in folder it does not hold, after the others; a built-in
 * song it places nowhere stands last in its collection's folder, in the archive with it while that
 * folder is; an own song it places nowhere stands at Home.
 */
export function arrangeLibrary(
  state: Pick<LibraryState, 'folders' | 'home' | 'archive'>,
  catalog: LibraryCatalog,
): LibraryLayout {
  const collectionOf = new Map<PieceId, SongCollectionId>()
  for (const collection of catalog.collections)
    for (const song of collection.songs) collectionOf.set(song, collection.id)
  const own = new Set(catalog.ownSongs)
  const placed = new Set<PieceId>()
  const take = (songs: readonly PieceId[]): PieceId[] =>
    songs.filter(
      (id) => (collectionOf.has(id) || own.has(id)) && !placed.has(id) && Boolean(placed.add(id)),
    )
  const shelve = (folder: SavedFolder): Shelving => ({
    ...folder,
    builtIn: !isOwnFolderId(folder.id),
    songs: take(folder.songs),
  })

  const folders = reachableFolders(state.folders.map(shelve))
  const home = take(state.home)
  const archived: Shelving[] = []
  const archive = state.archive.flatMap((entry): ShelvedEntry[] => {
    if (entry.kind === 'song') return take([entry.id]).length > 0 ? [entry] : []
    const folder = shelve(entry.folder)
    // Under the folder archived, each folder stands where it stood; one whose place is lost, in it.
    const subfolders = reachableFolders([
      { ...folder, parent: null },
      ...entry.subfolders.map(shelve),
    ])
      .slice(1)
      .map((each) => (each.parent === null ? { ...each, parent: folder.id } : each))
    archived.push(folder, ...subfolders)
    return [{ ...entry, folder, subfolders }]
  })
  const held = new Set([...folders, ...archived].map((folder) => folder.id))
  for (const collection of catalog.collections)
    if (!held.has(collection.id))
      folders.push({
        id: collection.id,
        parent: null,
        ...COLLECTION_LOOKS[collection.id],
        builtIn: true,
        songs: [],
      })

  // Each song placed nowhere: a built-in one last in its collection's folder, wherever that stands.
  const folderOf = new Map([...folders, ...archived].map((folder) => [folder.id, folder]))
  for (const collection of catalog.collections)
    for (const song of collection.songs)
      if (!placed.has(song)) {
        placed.add(song)
        folderOf.get(collection.id)?.songs.push(song)
      }
  home.push(...catalog.ownSongs.filter((id) => !placed.has(id)))
  return { folders, home, archive }
}

const savedFolder = ({ builtIn: _, ...folder }: ShelvedFolder): SavedFolder => folder

/** A layout as the store saves it: every folder held, with every song it holds. */
export function savedLayout(
  layout: LibraryLayout,
): Pick<LibraryState, 'folders' | 'home' | 'archive'> {
  return {
    folders: layout.folders.map(savedFolder),
    home: layout.home,
    archive: layout.archive.map((entry): ArchiveEntry =>
      entry.kind === 'song'
        ? entry
        : {
            ...entry,
            folder: savedFolder(entry.folder),
            subfolders: entry.subfolders.map(savedFolder),
          },
    ),
  }
}

/** Where a song stands in the library: its folder or Home and its place; `archived`; or nowhere. */
export function placeIn(layout: LibraryLayout, id: PieceId): SongPlace | 'archived' | null {
  const atHome = layout.home.indexOf(id)
  if (atHome >= 0) return { folder: null, index: atHome }
  for (const folder of layout.folders) {
    const index = folder.songs.indexOf(id)
    if (index >= 0) return { folder: folder.id, index }
  }
  const archived = layout.archive.some((entry) =>
    entry.kind === 'song' ? entry.id === id : archivedSongs(entry).includes(id),
  )
  return archived ? 'archived' : null
}

/** Every song an archived folder holds, in it and in the folders under it. */
export const archivedSongs = (
  entry: Pick<Extract<ShelvedEntry, { kind: 'folder' }>, 'folder' | 'subfolders'>,
): PieceId[] => [entry.folder, ...entry.subfolders].flatMap((folder) => folder.songs)
