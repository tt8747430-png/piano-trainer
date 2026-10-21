import { isSongCollectionId } from '@/entities/piece'
import { isStage } from '@/entities/step'
import type { SongsFilter, SongsShelf } from '@/pages/songs'
import { readText, valueOr } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

const isCollection = (value: unknown): value is SongsShelf | 'all' =>
  value === 'all' || value === 'mine' || isSongCollectionId(value)

export const SONGS_DEFAULTS: SongsFilter = {
  q: '',
  collection: 'all',
  withChords: false,
  stage: 'any',
}
function readSongsSearch(raw: Raw): SongsFilter {
  return {
    q: readText(raw.q, SONGS_DEFAULTS.q),
    collection: valueOr(isCollection, raw.collection, SONGS_DEFAULTS.collection),
    withChords: raw.withChords === true,
    stage: isStage(raw.stage) ? raw.stage : SONGS_DEFAULTS.stage,
  }
}
export const songsSearch = routeSearch(readSongsSearch, SONGS_DEFAULTS)

// A shared song: its link's text, only read as text here, so the router carries no decoder.
export const validateSharedSongSearch = (raw: Raw): { song: string } => ({
  song: readText(raw.song, ''),
})
