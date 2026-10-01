import type { Level } from '@/entities/path'
import type { CollectionId } from '@/entities/piece'

/** A shelf of Songs: a collection, or the learner's own songs. */
export type SongsShelf = CollectionId | 'mine'

/** What narrows the Songs list: the search, one shelf, one level. */
export interface SongsFilter {
  readonly q: string
  readonly collection: SongsShelf | 'all'
  readonly level: Level | 'any'
}
