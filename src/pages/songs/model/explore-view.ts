import type { PublicSort } from '@/shared/api/public-library'
import type { SongsFilter } from './songs-filter'

/** Songs' two views (D1): the learner's library, and Explore, what learners published. */
export type SongsView = 'mine' | 'explore'

/** What Explore lists (R72): the songs learners published, or the people who publish them. */
export type ExploreKind = 'songs' | 'people'
export const EXPLORE_KINDS = ['songs', 'people'] as const satisfies readonly ExploreKind[]

/**
 * Explore's kinds as chips (R72): every song, those tagged with one of Publish's suggested styles,
 * or the patterns. Each style is the tag Publish suggests, as it writes it (`EXPLORE_TAGS`).
 */
export const EXPLORE_CATEGORIES = [
  'all',
  'classical',
  'folk',
  'pop',
  'hymn',
  'study',
  'patterns',
] as const
export type ExploreCategory = (typeof EXPLORE_CATEGORIES)[number]
export const EXPLORE_TAGS = {
  classical: 'Classical',
  folk: 'Folk',
  pop: 'Pop',
  hymn: 'Hymn',
  study: 'Study',
} as const satisfies Partial<Record<ExploreCategory, string>>

/** Explore's shelves, each an order: the newest, the most saved, the top rated. */
export const EXPLORE_SHELVES = ['new', 'saved', 'rated'] as const satisfies readonly PublicSort[]

/**
 * What Explore shows (its URL): the search (`q`, the library's own), Songs or People, a kind's chip, and a
 * shelf's See all (`shelf`, its order), or the shelves where none.
 */
export interface ExploreView {
  readonly view: SongsView
  /** Songs or People (R72). */
  readonly kind: ExploreKind
  readonly cat: ExploreCategory
  /** One person's songs alone, as People names them (R72); everyone's where empty. */
  readonly by: string
  readonly shelf: PublicSort | ''
}

/** Songs' Home: its view, the library's filters and Explore's. */
export type SongsHome = SongsFilter & ExploreView
