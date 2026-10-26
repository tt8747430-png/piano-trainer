import type { CollectionId } from '@/entities/piece'
import type { Stage } from '@/entities/step'

/** A shelf of Songs: a collection, the learner's own songs, or their favourites (ADR 0103). */
export type SongsShelf = CollectionId | 'mine' | 'favourites'

/** What Songs shows (its tab): every collection, one shelf, or the learner's setlists (ADR 0103). */
export type SongsTab = SongsShelf | 'all' | 'setlists'

/** What narrows the Songs list: the search, one tab, one level, songs with chords, the chords known. */
export interface SongsFilter {
  readonly q: string
  readonly collection: SongsTab
  /** Only the songs that play: none whose chart is still to come. */
  readonly withChords: boolean
  /** Only the songs of one level, as their courses place them (ADR 0005); a song in no course has none. */
  readonly stage: Stage | 'any'
  /**
   * The chords the learner knows, as the URL writes them (`Am.C.G`, `chordListParam`): only the
   * songs that use no other stay (ADR 0103); none, every song.
   */
  readonly known: string
}
