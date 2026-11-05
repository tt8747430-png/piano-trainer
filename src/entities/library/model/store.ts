import type { StoreApi } from 'zustand/vanilla'
import { isSongCollectionId, type PieceId } from '@/entities/piece'
import { createSavedStore, isOneOf, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import {
  COLLECTION_LOOKS,
  FOLDER_PAINTS,
  FOLDER_PICTURES,
  folderName,
  isOwnFolderId,
  isPieceIdText,
  LIBRARY_SORTS,
  MOST_FOLDERS,
  MOST_PIECES,
  ownFolderNumber,
  type ArchiveEntry,
  type FolderId,
  type FolderLook,
  type LibrarySort,
  type SavedFolder,
  type SongPlace,
} from './types'
import { sanitiseCardLooks, type CardLook } from './card-look'
import { isEmptyDetails, sanitiseSongDetails, type SongDetails } from './song-details'

/** Where a card look is kept: a folder, or Home (R29 B9). */
export type CardPlace = FolderId | 'home'

export const LIBRARY_STORAGE_KEY = 'pt-library'
export const LIBRARY_VERSION = 5

/**
 * The learner's library (ADR 0106), only what they changed: read over the catalog
 * (`arrangeLibrary`), what it does not hold stands where the catalog puts it.
 */
export interface LibraryState {
  /** The folders in the library, each saying the folder it stands in, those of one place in order. */
  readonly folders: readonly SavedFolder[]
  /** The songs at Home, after the folders, in order. */
  readonly home: readonly PieceId[]
  /** The newest first. */
  readonly favourites: readonly PieceId[]
  /** What was archived, the newest first, each saying where it stood. */
  readonly archive: readonly ArchiveEntry[]
  readonly sort: LibrarySort
  /** The next own folder's number: a deleted folder's id is never given again. */
  readonly nextFolder: number
  /** How each place draws its rows, where the learner (or an editor, for everyone) styled them (B9). */
  readonly cardLooks: Partial<Record<CardPlace, CardLook>>
  /** A song's own colour and picture (B9, Appearance), where the learner gave it one. */
  readonly songLooks: Partial<Record<PieceId, FolderLook>>
  /** A song's details in the library (R30 S5: level, genre, language, tags), where the learner gave some. */
  readonly songDetails: Partial<Record<PieceId, SongDetails>>
}

export type LibraryStore = StoreApi<LibraryState>

export const INITIAL_LIBRARY: LibraryState = {
  folders: [],
  home: [],
  favourites: [],
  archive: [],
  sort: 'manual',
  nextFolder: 1,
  cardLooks: {},
  songLooks: {},
  songDetails: {},
}

export const createLibraryStore = (saving: SavingOptions = {}): LibraryStore =>
  createSavedStore(
    {
      key: LIBRARY_STORAGE_KEY,
      version: LIBRARY_VERSION,
      initial: INITIAL_LIBRARY,
      read: sanitize,
    },
    saving,
  )

const isFolderId = (value: unknown): value is FolderId =>
  isOwnFolderId(value) || isSongCollectionId(value)
const isPicture = isOneOf(FOLDER_PICTURES)
const isPaint = isOneOf(FOLDER_PAINTS)
const isSort = isOneOf(LIBRARY_SORTS)

/** An own folder's look where its save has none that reads. */
const OWN_LOOK: FolderLook = { picture: 'music', paint: 'sand' }

/** A saved list of songs: each id that can name one and no list before has, in order, as many as a list keeps. */
const songsOf = (saved: unknown, taken: Set<PieceId>): PieceId[] =>
  (Array.isArray(saved) ? saved : [])
    .filter((id): id is PieceId => isPieceIdText(id) && !taken.has(id) && Boolean(taken.add(id)))
    .slice(0, MOST_PIECES)

/**
 * A saved folder that reads: its id, the folder it stands in (Home where none reads, or it names
 * itself), its look (its default where it does not read), its name, its songs.
 */
function folderOf(saved: unknown, taken: Set<PieceId>): SavedFolder | null {
  if (!isRecord(saved) || !isFolderId(saved.id)) return null
  const parent = isFolderId(saved.parent) && saved.parent !== saved.id ? saved.parent : null
  const look = isSongCollectionId(saved.id) ? COLLECTION_LOOKS[saved.id] : OWN_LOOK
  const name = typeof saved.name === 'string' ? folderName(saved.name) : null
  // An own folder needs its name; a built-in one without one says its collection's.
  if (!name && isOwnFolderId(saved.id)) return null
  return {
    id: saved.id,
    parent,
    ...(name ? { name } : {}),
    picture: isPicture(saved.picture) ? saved.picture : look.picture,
    paint: isPaint(saved.paint) ? saved.paint : look.paint,
    songs: songsOf(saved.songs, taken),
  }
}

const indexOf = (value: unknown): number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0

function placeOf(saved: unknown): SongPlace {
  const place = savedObject<SongPlace>(saved)
  return { folder: isFolderId(place.folder) ? place.folder : null, index: indexOf(place.index) }
}

/** Each song's look that reads: a picture and a paint of the lists, else none. */
/** The songs' details kept: each song's that says something, by a song's id. */
function songDetailsOf(saved: unknown): Partial<Record<PieceId, SongDetails>> {
  if (!isRecord(saved)) return {}
  const kept: Partial<Record<PieceId, SongDetails>> = {}
  for (const [id, value] of Object.entries(saved)) {
    const details = sanitiseSongDetails(value)
    if (isPieceIdText(id) && !isEmptyDetails(details)) kept[id] = details
  }
  return kept
}

function songLooksOf(saved: unknown): Partial<Record<PieceId, FolderLook>> {
  if (!isRecord(saved)) return {}
  const looks: Partial<Record<PieceId, FolderLook>> = {}
  for (const [id, look] of Object.entries(saved))
    if (isPieceIdText(id) && isRecord(look) && isPicture(look.picture) && isPaint(look.paint))
      looks[id] = { picture: look.picture, paint: look.paint }
  return looks
}

/** Stored JSON is untrusted: what reads is kept, each folder and each song once, as many as are kept. */
function sanitize(persisted: unknown): LibraryState {
  const saved = savedObject<LibraryState>(persisted)
  const songs = new Set<PieceId>()
  const folderIds = new Set<FolderId>()
  // Each folder once, in the library or in the archive (under another archived), as many as are kept.
  const once = (folder: SavedFolder | null): folder is SavedFolder =>
    folder !== null && !folderIds.has(folder.id) && folderIds.size < MOST_FOLDERS
      ? Boolean(folderIds.add(folder.id))
      : false
  const folders = (Array.isArray(saved.folders) ? saved.folders : [])
    .map((value) => folderOf(value, songs))
    .filter(once)
  const home = songsOf(saved.home, songs)
  const archive = (Array.isArray(saved.archive) ? saved.archive : []).flatMap(
    (value): ArchiveEntry[] => {
      if (!isRecord(value)) return []
      if (value.kind === 'song') {
        const [id] = songsOf([value.id], songs)
        return id ? [{ kind: 'song', id, from: placeOf(value.from) }] : []
      }
      const folder = value.kind === 'folder' ? folderOf(value.folder, songs) : null
      if (!once(folder)) return []
      const subfolders = (Array.isArray(value.subfolders) ? value.subfolders : [])
        .map((each) => folderOf(each, songs))
        .filter(once)
      return [{ kind: 'folder', folder, subfolders, index: indexOf(value.index) }]
    },
  )
  // Past every own folder read: none is given again.
  const past =
    Math.max(0, ...[...folderIds].filter(isOwnFolderId).map((id) => ownFolderNumber(id))) + 1
  const next =
    typeof saved.nextFolder === 'number' && Number.isSafeInteger(saved.nextFolder)
      ? saved.nextFolder
      : 1
  return {
    folders,
    home,
    favourites: songsOf(saved.favourites, new Set()),
    archive: archive.slice(0, MOST_PIECES),
    sort: isSort(saved.sort) ? saved.sort : 'manual',
    nextFolder: Math.max(next, past, 1),
    songLooks: songLooksOf(saved.songLooks),
    songDetails: songDetailsOf(saved.songDetails),
    cardLooks: sanitiseCardLooks(
      saved.cardLooks,
      (place): place is CardPlace => place === 'home' || isFolderId(place),
    ),
  }
}
