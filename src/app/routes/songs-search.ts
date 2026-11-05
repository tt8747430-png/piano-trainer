import { isStage } from '@/entities/step'
import type { ExploreCategory, FolderSearch, SongsFilter, SongsHome } from '@/pages/songs'
import { readText } from '@/shared/lib'
import { keyParam, parseKey } from '@/shared/lib/music'
import { routeSearch, type Raw } from './read-search'

// The library's filters, at Home and in a folder alike (ADR 0106): in the URL, never remembered.
export const SONGS_DEFAULTS: SongsFilter = {
  q: '',
  stage: 'any',
  key: '',
  favourites: false,
}
/** A key as a song is written in, spelled as written (a song in G♭ is not one in F♯); none if none reads. */
function readSongKey(raw: unknown): SongsFilter['key'] {
  const key = typeof raw === 'string' ? parseKey(raw) : null
  return key ? keyParam(key) : ''
}
function readSongsSearch(raw: Raw): SongsFilter {
  return {
    q: readText(raw.q, SONGS_DEFAULTS.q),
    stage: isStage(raw.stage) ? raw.stage : SONGS_DEFAULTS.stage,
    key: readSongKey(raw.key),
    favourites: raw.favourites === true,
  }
}
// A folder's: the filters, and its Edit (the folder's name and look in place), entered from its ✎ or
// a folder row's Edit.
export const FOLDER_DEFAULTS: FolderSearch = { ...SONGS_DEFAULTS, edit: false }
const readFolderSearch = (raw: Raw): FolderSearch => ({
  ...readSongsSearch(raw),
  edit: raw.edit === true,
})
export const folderSearch = routeSearch(readFolderSearch, FOLDER_DEFAULTS)

// A song's page (R30 S4): in Edit or not, entered from its ✎.
export const PIECE_DEFAULTS: { edit: boolean } = { edit: false }
export const pieceSearch = routeSearch((raw: Raw) => ({ edit: raw.edit === true }), PIECE_DEFAULTS)

// Songs' Home (D1): My songs or Explore, remembered as Learn's view is; Explore's category chip
// and a shelf's See all in the URL beside the library's filters.
export const SONGS_HOME_DEFAULTS: SongsHome = {
  ...SONGS_DEFAULTS,
  view: 'mine',
  cat: 'all',
  shelf: '',
}
const CATEGORIES: readonly string[] = [
  'all',
  'classical',
  'folk',
  'pop',
  'studies',
  'patterns',
] satisfies readonly ExploreCategory[]
const isCategory = (value: unknown): value is ExploreCategory =>
  typeof value === 'string' && CATEGORIES.includes(value)
const isShelf = (value: unknown): value is SongsHome['shelf'] =>
  value === 'new' || value === 'saved' || value === 'rated'
export function readSongsHomeSearch(raw: Raw): SongsHome {
  return {
    ...readSongsSearch(raw),
    view: raw.view === 'explore' ? 'explore' : 'mine',
    cat: isCategory(raw.cat) ? raw.cat : SONGS_HOME_DEFAULTS.cat,
    shelf: isShelf(raw.shelf) ? raw.shelf : SONGS_HOME_DEFAULTS.shelf,
  }
}
export const songsHomeSearch = routeSearch(readSongsHomeSearch, SONGS_HOME_DEFAULTS)
/** What Songs' Home remembers: its view alone; the filters and Explore's are one visit's. */
export const SONGS_KEPT = ['view'] as const satisfies readonly (keyof SongsHome)[]

// A shared song: its link's text, only read as text here, so the router carries no decoder.
export const validateSharedSongSearch = (raw: Raw): { song: string } => ({
  song: readText(raw.song, ''),
})
