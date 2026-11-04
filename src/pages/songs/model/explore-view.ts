import type { PublicCategory, PublicSort } from '@/shared/api/public-library'
import type { SongsFilter } from './songs-filter'

/** Songs' two views (D1): the learner's library, and Explore, what learners published. */
export type SongsView = 'mine' | 'explore'

/** Explore's chips: every song, one category's, or the patterns. */
export type ExploreCategory = 'all' | PublicCategory | 'patterns'
export const EXPLORE_CATEGORIES = [
  'all',
  'classical',
  'folk',
  'pop',
  'studies',
  'patterns',
] as const satisfies readonly ExploreCategory[]

/** Explore's shelves, each an order: the newest, the most saved, the top rated. */
export const EXPLORE_SHELVES = ['new', 'saved', 'rated'] as const satisfies readonly PublicSort[]

/**
 * What Explore shows (its URL): the search (`q`, the library's own), a category's chip, and a
 * shelf's See all (`shelf`, its order), or the shelves where none.
 */
export interface ExploreView {
  readonly view: SongsView
  readonly cat: ExploreCategory
  readonly shelf: PublicSort | ''
}

/** Songs' Home: its view, the library's filters and Explore's. */
export type SongsHome = SongsFilter & ExploreView
