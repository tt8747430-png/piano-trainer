import { useSearch } from '@tanstack/react-router'
import { ExploreScreen } from './ExploreScreen'
import { LibraryScreen } from './LibraryScreen'

/**
 * Songs (D1): its bar's switch between My songs, the library's Home (ADR 0106: its folders, then
 * the songs that stand at Home), and Explore, what learners published.
 */
export function SongsPage() {
  const search = useSearch({ from: '/shell/songs' })
  return search.view === 'explore' ? (
    <ExploreScreen home={search} />
  ) : (
    <LibraryScreen folder={null} filter={search} />
  )
}
