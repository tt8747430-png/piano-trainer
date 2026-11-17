import type {
  AllSongsSearch,
  ExploreCategory,
  FolderSearch,
  SongsFilter,
  SongsHome,
} from '@/pages/songs'
import { readText } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

// The library's search, at Home and in a folder alike (ADR 0106, R72): in the URL, never remembered.
export const SONGS_DEFAULTS: SongsFilter = { q: '' }
function readSongsSearch(raw: Raw): SongsFilter {
  return { q: readText(raw.q, SONGS_DEFAULTS.q) }
}
// A folder's: the search, and its Edit (the folder's name and look in place), entered from its ✎ or
// a folder row's Edit.
export const FOLDER_DEFAULTS: FolderSearch = { ...SONGS_DEFAULTS, edit: false }
const readFolderSearch = (raw: Raw): FolderSearch => ({
  ...readSongsSearch(raw),
  edit: raw.edit === true,
})
export const folderSearch = routeSearch(readFolderSearch, FOLDER_DEFAULTS)
// All songs (R72, Flat's library): every song in one list, searched and sorted; My songs' Favourites
// card opens it on the favourites alone.
const ALL_SONGS_DEFAULTS: AllSongsSearch = { ...SONGS_DEFAULTS, favourites: false }
const readAllSongsSearch = (raw: Raw): AllSongsSearch => ({
  ...readSongsSearch(raw),
  favourites: raw.favourites === true,
})
export const allSongsSearch = routeSearch(readAllSongsSearch, ALL_SONGS_DEFAULTS)

// A song's page (R30 S4): in Edit or not, entered from its ✎.

// Songs' Home (D1): My songs or Explore, remembered as Learn's view is; Explore's Songs or People, its kind chip
// and a shelf's See all in the URL beside the library's filters.
export const SONGS_HOME_DEFAULTS: SongsHome = {
  ...SONGS_DEFAULTS,
  view: 'mine',
  kind: 'songs',
  cat: 'all',
  by: '',
  shelf: '',
}
const CATEGORIES = [
  'all',
  'classical',
  'folk',
  'pop',
  'hymn',
  'study',
  'patterns',
] as const satisfies readonly ExploreCategory[]
const isCategory = (value: unknown): value is ExploreCategory =>
  CATEGORIES.some((each) => each === value)
const isShelf = (value: unknown): value is SongsHome['shelf'] =>
  value === 'new' || value === 'saved' || value === 'rated'
export function readSongsHomeSearch(raw: Raw): SongsHome {
  return {
    ...readSongsSearch(raw),
    view: raw.view === 'explore' ? 'explore' : 'mine',
    kind: raw.kind === 'people' ? 'people' : 'songs',
    cat: isCategory(raw.cat) ? raw.cat : SONGS_HOME_DEFAULTS.cat,
    by: readText(raw.by, ''),
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

// An invite link to a group (R30 S6): its code, only read as text.
export const validateJoinGroupSearch = (raw: Raw): { code: string } => ({
  code: readText(raw.code, ''),
})
