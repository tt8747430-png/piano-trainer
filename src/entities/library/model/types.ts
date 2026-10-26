import type { PieceId, SongCollectionId } from '@/entities/piece'
import type { Paint } from '@/shared/ui'

/** A folder the learner made: `folder-` and its number, never given twice. */
export type OwnFolderId = `folder-${number}`

/** A folder of the library (ADR 0106): a collection's, the app's from the start, or the learner's own. */
export type FolderId = SongCollectionId | OwnFolderId

/** The pictures of music a folder wears, by name (`ui/folder-pictures.ts` draws each). */
export const FOLDER_PICTURES = [
  'music',
  'piano',
  'mic',
  'guitar',
  'headphones',
  'drum',
  'church',
  'book',
  'heart',
  'star',
  'sun',
  'leaf',
] as const
export type FolderPicture = (typeof FOLDER_PICTURES)[number]

/** The theme's paints a folder's tile is painted in. */
export const FOLDER_PAINTS = [
  'sand',
  'sky',
  'grass',
  'yellow',
  'lilac',
] as const satisfies readonly Paint[]
export type FolderPaint = (typeof FOLDER_PAINTS)[number]

/** How a folder looks: its picture on its paint. */
export interface FolderLook {
  readonly picture: FolderPicture
  readonly paint: FolderPaint
}

/**
 * A folder as saved: the folder it stands in (`null`: Home; ADR 0106's folders nest, to any depth),
 * its look, the name the learner gave it (none: a collection's own), its songs in order. Folders in
 * one place stand in the order the store lists them.
 */
export interface SavedFolder extends FolderLook {
  readonly id: FolderId
  readonly parent: FolderId | null
  readonly name?: string
  readonly songs: readonly PieceId[]
}

/** Where a song stands: in a folder or at Home (`null`), at its place in that list. */
export interface SongPlace {
  readonly folder: FolderId | null
  readonly index: number
}

/**
 * What the archive holds (ADR 0106, Mindscape's ADR 0003): a song, or a folder with its songs and
 * every folder under it (`subfolders`, each saying the one it stands in); the folder's `parent` and
 * `index` say where it stood among the folders there.
 */
export type ArchiveEntry =
  | { readonly kind: 'song'; readonly id: PieceId; readonly from: SongPlace }
  | {
      readonly kind: 'folder'
      readonly folder: SavedFolder
      readonly subfolders: readonly SavedFolder[]
      readonly index: number
    }

/** How the library's songs are listed: as the learner dragged them, by name, played last first, or by key. */
export const LIBRARY_SORTS = ['manual', 'name', 'recent', 'key'] as const
export type LibrarySort = (typeof LIBRARY_SORTS)[number]

/** The longest name a folder takes. */
export const FOLDER_NAME_MAX = 40
/** The most folders the library keeps, in it and in the archive. */
export const MOST_FOLDERS = 100
/** The most songs a list keeps: a folder's, Home's, the favourites, the archive's. */
export const MOST_PIECES = 500

/** The longest id a saved list keeps: a piece's id is a plain name (`PieceId`). */
const PIECE_ID_MAX = 100
const OWN_FOLDER_ID = /^folder-[1-9]\d*$/

export const isOwnFolderId = (value: unknown): value is OwnFolderId =>
  typeof value === 'string' && OWN_FOLDER_ID.test(value)
export const ownFolderId = (number: number): OwnFolderId => `folder-${number}`
/** The number an own folder's id carries. */
export const ownFolderNumber = (id: OwnFolderId): number => Number(id.slice('folder-'.length))

/** A name as a folder keeps it: trimmed, 1 to 40 characters; null where none is left. */
export function folderName(text: string): string | null {
  const name = text.trim()
  return name.length > 0 && name.length <= FOLDER_NAME_MAX ? name : null
}

/** Whether a saved value can name a piece: an id that may name one the repertoire has. */
export const isPieceIdText = (value: unknown): value is PieceId =>
  typeof value === 'string' && value.length > 0 && value.length <= PIECE_ID_MAX

/** Each built-in folder's look until the learner changes it: a picture that fits its songs. */
export const COLLECTION_LOOKS: Readonly<Record<SongCollectionId, FolderLook>> = {
  'learning-songs': { picture: 'music', paint: 'yellow' },
  'bozhe-spasibo': { picture: 'heart', paint: 'sand' },
  'called-to-play': { picture: 'piano', paint: 'sky' },
  'called-to-play-2': { picture: 'book', paint: 'lilac' },
  hymns: { picture: 'church', paint: 'grass' },
  gorshkov: { picture: 'mic', paint: 'sand' },
}
