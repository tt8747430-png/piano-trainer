import type { CollectionId } from '@/entities/piece'
import type { Stage } from '@/entities/step'

/** A shelf of Songs: a collection, or the learner's own songs. */
export type SongsShelf = CollectionId | 'mine'

/** What narrows the Songs list: the search, one shelf, one level, and whether only songs with chords show. */
export interface SongsFilter {
  readonly q: string
  readonly collection: SongsShelf | 'all'
  /** Only the songs that play: none whose chart is still to come. */
  readonly withChords: boolean
  /** Only the songs of one level, as their courses place them (ADR 0005); a song in no course has none. */
  readonly stage: Stage | 'any'
}
