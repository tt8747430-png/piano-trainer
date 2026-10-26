import { isStage } from '@/entities/step'
import type { SongsFilter } from '@/pages/songs'
import { chordListParam, readChordList, readText } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

// The library's filters, at Home and in a folder alike (ADR 0106): in the URL, never remembered.
export const SONGS_DEFAULTS: SongsFilter = {
  q: '',
  withChords: false,
  stage: 'any',
  known: '',
  favourites: false,
}
function readSongsSearch(raw: Raw): SongsFilter {
  return {
    q: readText(raw.q, SONGS_DEFAULTS.q),
    withChords: raw.withChords === true,
    stage: isStage(raw.stage) ? raw.stage : SONGS_DEFAULTS.stage,
    // The chords known, as the URL writes them: each that reads, once, in one order (ADR 0103).
    known: chordListParam(readChordList(raw.known)),
    favourites: raw.favourites === true,
  }
}
export const songsSearch = routeSearch(readSongsSearch, SONGS_DEFAULTS)

// A shared song: its link's text, only read as text here, so the router carries no decoder.
export const validateSharedSongSearch = (raw: Raw): { song: string } => ({
  song: readText(raw.song, ''),
})
