import type { Stage } from '@/entities/step'
import type { KeyParam } from '@/shared/lib/music'

/**
 * What narrows the library's songs (ADR 0106), at Home through the whole library, in a folder
 * through all it holds: the search, one level, one key, the favourites, the songs in no folder, the
 * songs learned or not yet. In the URL, never
 * remembered.
 */
export interface SongsFilter {
  readonly q: string
  /** Only the songs of one level, as their courses place them (ADR 0053); a song in no course has none. */
  readonly stage: Stage | 'any'
  /** Only the songs written in one key, as the URL writes it (`G`, `Em`); none, every key. */
  readonly key: KeyParam | ''
  /** Only the learner's favourites. */
  readonly favourites: boolean
  /** Only the songs in no folder (R31-S): Home's own, at Home. */
  readonly folder: 'any' | 'none'
  /** Only the songs learned, or only those not learned yet (R31-S). */
  readonly learned: 'any' | 'yes' | 'no'
}

/** A folder's URL: the library's filters, and whether the folder is in Edit (its name and look in place). */
export interface FolderSearch extends SongsFilter {
  readonly edit: boolean
}
