import type { CollectionId } from '@/entities/piece'

/** A shelf of Songs: a collection, or the learner's own songs. */
export type SongsShelf = CollectionId | 'mine'

/** What narrows the Songs list: the search, one shelf, and whether only songs with chords show. */
export interface SongsFilter {
  readonly q: string
  readonly collection: SongsShelf | 'all'
  /** Only the songs that play: none whose chart is still to come. */
  readonly withChords: boolean
}
