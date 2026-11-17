import { useSearch } from '@tanstack/react-router'
import { ExploreScreen } from './ExploreScreen'
import { LibraryScreen } from './LibraryScreen'
import { SongsOverview } from './SongsOverview'

/**
 * Songs (D1): its bar's switch between My songs, the library's overview (R72, Flat's: Recently
 * played, the Folders, the Archive and the Trash), and Explore, what learners published.
 */
export function SongsPage() {
  const search = useSearch({ from: '/shell/songs' })
  if (search.view === 'explore') return <ExploreScreen home={search} />
  return <SongsOverview />
}

/** All songs (R72, Flat's library): every song in one list, to search, sort and select. */
export function AllSongsPage() {
  const search = useSearch({ from: '/shell/songs/all' })
  return (
    <LibraryScreen folder={null} filter={search} all={search.favourites ? 'favourites' : 'all'} />
  )
}
