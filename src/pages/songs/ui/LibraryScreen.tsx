import { useNavigate } from '@tanstack/react-router'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import type { SongsFilter } from '../model/songs-filter'
import { useLibraryPage } from '../model/use-library-page'
import { LibraryBrowse } from './LibraryBrowse'
import { LibraryDialogs } from './LibraryDialogs'
import { LibraryEmpty } from './LibraryEmpty'
import { LibraryFilters } from './LibraryFilters'
import { LibraryHeader } from './LibraryHeader'
import { LibrarySelect } from './LibrarySelect'
import { NewActions } from './NewActions'
import { SelectionBar } from './SelectionBar'

/**
 * A place of the library (ADR 0106, Mindscape's `DeckLibraryPage`): Home (`folder` null), its
 * folders then its own songs, or a folder, its songs; the bar, the search and filters, the rows read
 * or chosen in Select, and New floating, or Select's bar in its place.
 */
export function LibraryScreen({
  folder,
  filter,
}: {
  folder: ShelvedFolder | null
  filter: SongsFilter
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const navigate = useNavigate()
  const q = useDeferredValue(filter.q)
  const page = useLibraryPage(folder, { ...filter, q })
  // No search, level, With chords, favourites or chords known: the route fills its defaults.
  const clear = () => void navigate({ to: '.', search: {}, replace: true })
  const { view } = page
  const empty = view.folders.length === 0 && view.shown === 0
  return (
    <div className="flex flex-col gap-4 pb-4">
      <LibraryHeader page={page} folder={folder} />
      <LibraryFilters page={page} filter={filter} screen={folder ? nameOf(folder) : t('title')} />
      {empty ? (
        <LibraryEmpty page={page} inFolder={folder !== null} filter={filter} onClear={clear} />
      ) : page.select.on ? (
        <LibrarySelect page={page} />
      ) : (
        <LibraryBrowse page={page} onClear={clear} />
      )}
      {page.select.on ? (
        <SelectionBar page={page} />
      ) : (
        <NewActions page={page} folder={folder?.id ?? null} />
      )}
      <LibraryDialogs page={page} folder={folder} />
    </div>
  )
}
