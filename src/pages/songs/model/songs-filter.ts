import type { Stage } from '@/entities/step'
import type { KeyParam } from '@/shared/lib/music'

/**
 * What narrows the library's songs (ADR 0106), at Home through the whole library, in a folder
 * through all it holds: the search, one level, one key, the favourites. In the URL, never
 * remembered.
 */
export interface SongsFilter {
  readonly q: string
  /** Only the songs of one level, as their courses place them (ADR 0005); a song in no course has none. */
  readonly stage: Stage | 'any'
  /** Only the songs written in one key, as the URL writes it (`G`, `Em`); none, every key. */
  readonly key: KeyParam | ''
  /** Only the learner's favourites. */
  readonly favourites: boolean
}
