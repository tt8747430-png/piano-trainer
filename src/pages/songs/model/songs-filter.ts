import type { Level } from '@/entities/path'
import type { CollectionId } from '@/entities/piece'

/** What narrows the Songs list: the search, one collection, one level. */
export interface SongsFilter {
  readonly q: string
  readonly collection: CollectionId | 'all'
  readonly level: Level | 'any'
}
