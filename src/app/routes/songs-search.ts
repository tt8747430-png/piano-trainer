import { isStage } from '@/entities/step'
import type { SongsFilter } from '@/pages/songs'
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
export const songsSearch = routeSearch(readSongsSearch, SONGS_DEFAULTS)

// A shared song: its link's text, only read as text here, so the router carries no decoder.
export const validateSharedSongSearch = (raw: Raw): { song: string } => ({
  song: readText(raw.song, ''),
})
