import { isSongCollectionId } from '@/entities/piece'
import { isStage } from '@/entities/step'
import type { SetlistSearch } from '@/pages/setlist'
import type { SongsFilter, SongsTab } from '@/pages/songs'
import { chordListParam, readChordList, readText, valueOr } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

const isTab = (value: unknown): value is SongsTab =>
  value === 'all' ||
  value === 'mine' ||
  value === 'favourites' ||
  value === 'setlists' ||
  isSongCollectionId(value)

export const SONGS_DEFAULTS: SongsFilter = {
  q: '',
  collection: 'all',
  withChords: false,
  stage: 'any',
  known: '',
}
function readSongsSearch(raw: Raw): SongsFilter {
  return {
    q: readText(raw.q, SONGS_DEFAULTS.q),
    collection: valueOr(isTab, raw.collection, SONGS_DEFAULTS.collection),
    withChords: raw.withChords === true,
    stage: isStage(raw.stage) ? raw.stage : SONGS_DEFAULTS.stage,
    // The chords known, as the URL writes them: each that reads, once, in one order (ADR 0103).
    known: chordListParam(readChordList(raw.known)),
  }
}
export const songsSearch = routeSearch(readSongsSearch, SONGS_DEFAULTS)

// A setlist's page: what its search holds (ADR 0103).
const SETLIST_DEFAULTS: SetlistSearch = { q: '' }
export const setlistSearch = routeSearch(
  (raw): SetlistSearch => ({ q: readText(raw.q, SETLIST_DEFAULTS.q) }),
  SETLIST_DEFAULTS,
)

// A shared song: its link's text, only read as text here, so the router carries no decoder.
export const validateSharedSongSearch = (raw: Raw): { song: string } => ({
  song: readText(raw.song, ''),
})
