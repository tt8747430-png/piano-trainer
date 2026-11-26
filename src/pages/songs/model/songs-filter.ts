/**
 * What narrows the library's songs (ADR 0106, R72): the search alone, at Home through the whole
 * library, in a folder through all it holds. In the URL, never remembered.
 */
export interface SongsFilter {
  readonly q: string
}

/** All songs' URL (R72): the search, and whether it shows the favourites alone (My songs' Favourites card). */
export interface AllSongsSearch extends SongsFilter {
  readonly favourites: boolean
}

/** A folder's URL: the library's search, and whether the folder is in Edit (its name and look in place). */
export interface FolderSearch extends SongsFilter {
  readonly edit: boolean
}
