import { isSongCollectionId } from '@/entities/piece'
import type { SongsFilter, SongsShelf } from '@/pages/songs'
import { readText, valueOr } from '@/shared/lib'
import { isLevel, routeSearch, type Raw } from './read-search'

const isCollection = (value: unknown): value is SongsShelf | 'all' =>
  value === 'all' || value === 'mine' || isSongCollectionId(value)

export const SONGS_DEFAULTS: SongsFilter = { q: '', collection: 'all', level: 'any' }
export function readSongsSearch(raw: Raw): SongsFilter {
  return {
    q: readText(raw.q, SONGS_DEFAULTS.q),
    collection: valueOr(isCollection, raw.collection, SONGS_DEFAULTS.collection),
    level: valueOr(isLevel, raw.level, SONGS_DEFAULTS.level),
  }
}
export const songsSearch = routeSearch(readSongsSearch, SONGS_DEFAULTS)
