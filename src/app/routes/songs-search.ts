import { isSongCollectionId, type CollectionId } from '@/entities/piece'
import type { SongsFilter } from '@/pages/songs'
import { readText, valueOr } from '@/shared/lib'
import { isLevel, routeSearch, type Raw } from './read-search'

const isCollection = (value: unknown): value is CollectionId | 'all' =>
  value === 'all' || isSongCollectionId(value)

export const SONGS_DEFAULTS: SongsFilter = { q: '', collection: 'all', level: 'any' }
export function readSongsSearch(raw: Raw): SongsFilter {
  return {
    q: readText(raw.q, SONGS_DEFAULTS.q),
    collection: valueOr(isCollection, raw.collection, SONGS_DEFAULTS.collection),
    level: valueOr(isLevel, raw.level, SONGS_DEFAULTS.level),
  }
}
export const songsSearch = routeSearch(readSongsSearch, SONGS_DEFAULTS)
