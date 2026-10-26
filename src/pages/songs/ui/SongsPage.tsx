import { useSearch } from '@tanstack/react-router'
import { LibraryScreen } from './LibraryScreen'

/** Songs, the library's Home (ADR 0106): its folders, then the songs that stand at Home. */
export function SongsPage() {
  const search = useSearch({ from: '/shell/songs' })
  return <LibraryScreen folder={null} filter={search} />
}
