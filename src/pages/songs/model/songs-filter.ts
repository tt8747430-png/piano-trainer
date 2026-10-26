import type { Stage } from '@/entities/step'

/**
 * What narrows the library's songs (ADR 0106), at Home through the whole library, in a folder its
 * songs: the search, one level, songs with chords, the chords known, the favourites. In the URL, never
 * remembered.
 */
export interface SongsFilter {
  readonly q: string
  /** Only the songs that play: none whose chart is still to come. */
  readonly withChords: boolean
  /** Only the songs of one level, as their courses place them (ADR 0005); a song in no course has none. */
  readonly stage: Stage | 'any'
  /**
   * The chords the learner knows, as the URL writes them (`Am.C.G`, `chordListParam`): only the
   * songs that use no other stay; none, every song.
   */
  readonly known: string
  /** Only the learner's favourites. */
  readonly favourites: boolean
}
