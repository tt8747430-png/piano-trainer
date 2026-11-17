import type { SongsHome } from '../model/explore-view'

/** What a view of Songs starts from: nothing searched, filtered or chosen of the other's. */
export const FRESH: Omit<SongsHome, 'view'> = {
  q: '',
  kind: 'songs',
  cat: 'all',
  by: '',
  shelf: '',
}
