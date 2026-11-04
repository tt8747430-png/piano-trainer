import { Link, useNavigate } from '@tanstack/react-router'
import { Archive } from 'lucide-react'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { RowLink } from '@/shared/ui'
import { folderArchive, useFolderName, type ShelvedFolder } from '@/entities/library'
import { useSongDrop, useSongImport } from '@/features/song-files'
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
 * A place of the library (ADR 0106, Mindscape's `DeckLibraryPage`): Home (`folder` null, My songs
 * in Songs' switch), its folders then its own songs, or a folder, its songs; the bar, the search and filters, the rows read
 * or chosen in Select, and New floating (New song, New folder, Import), or Select's bar in its
 * place; a MusicXML or MIDI file dropped on it imported (ADR 0107).
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
  // Import, from New or a file dropped on the library, made where the learner is (ADR 0107).
  const songImport = useSongImport(folder?.id ?? null)
  const drop = useSongDrop(songImport.importFile)
  // No search, level, With chords, favourites or chords known: the route fills its defaults.
  const clear = () => void navigate({ to: '.', search: {}, replace: true })
  const { view } = page
  const empty = view.folders.length === 0 && view.shown === 0
  // The folder's songs archived from it (D10): its last row, Archived (n), while there are some.
  const archived = folder ? folderArchive(page.layout, folder.id).length : 0
  return (
    <div className="flex flex-col gap-4 pb-4" {...drop.dropProps}>
      <LibraryHeader page={page} folder={folder} />
      <LibraryFilters page={page} filter={filter} screen={folder ? nameOf(folder) : t('title')} />
      {empty ? (
        <LibraryEmpty page={page} inFolder={folder !== null} filter={filter} onClear={clear} />
      ) : page.select.on ? (
        // Select's bar in the rows' drag: its places take what a row's face carries.
        <LibrarySelect page={page} folder={folder}>
          <SelectionBar page={page} folder={folder} />
        </LibrarySelect>
      ) : (
        <LibraryBrowse page={page} onClear={clear} />
      )}
      {folder && archived > 0 && !page.select.on ? (
        <div className="card">
          <RowLink
            render={
              <Link to="/songs/folders/$folderId/archived" params={{ folderId: folder.id }} />
            }
            icon={Archive}
            paint="lilac"
            title={t('folder.archivedCount', { count: archived })}
          />
        </div>
      ) : null}
      {!page.select.on ? (
        <NewActions page={page} folder={folder?.id ?? null} onImport={songImport.choose} />
      ) : empty ? (
        <SelectionBar page={page} folder={folder} />
      ) : null}
      <LibraryDialogs page={page} folder={folder} />
      {songImport.view}
      {drop.panel}
    </div>
  )
}
