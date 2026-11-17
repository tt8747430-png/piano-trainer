import { Link, useNavigate } from '@tanstack/react-router'
import { Archive } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CountSort, LIBRARY_PANES, RowLink } from '@/shared/ui'
import {
  folderArchive,
  LIBRARY_SORTS,
  libraryCatalog,
  SORT_DIRECTIONS,
  useFolderName,
  useLibraryStoreApi,
  usePermissions,
  type ShelvedFolder,
} from '@/entities/library'
import { useRepertoire } from '@/entities/piece'
import { editFolder, FolderEditPanel, type FolderEdit } from '@/features/manage-library'
import { useSongDrop, useSongImport } from '@/features/song-files'
import { useMediaQuery, useSetSearch } from '@/shared/lib'
import type { FolderSearch, SongsFilter } from '../model/songs-filter'
import { useLibraryPage } from '../model/use-library-page'
import { LibraryBrowse } from './LibraryBrowse'
import { LibraryDialogs } from './LibraryDialogs'
import { LibraryEmpty } from './LibraryEmpty'
import { LibraryHeader } from './LibraryHeader'
import { LibrarySearch } from './LibrarySearch'
import { LibrarySelect } from './LibrarySelect'
import { NewActions, NewMenu } from './NewActions'
import { SelectionBar } from './SelectionBar'

/**
 * A list of the library's songs (ADR 0106, R72's LISTPAGE, Flat's library): All songs (every song,
 * or the favourites alone from My songs' card) or a folder, its folders first. The bar (Back, the
 * title, Select, ···, New), then the search and the count with its sort, side by side on a laptop,
 * then the songs' cards; Select's bar in New's place while choosing; a MusicXML or MIDI file dropped
 * on it imported (ADR 0107).
 */
export function LibraryScreen({
  folder,
  filter,
  inEdit = false,
  all = false,
}: {
  folder: ShelvedFolder | null
  filter: SongsFilter
  /** All songs, or its favourites alone: every song in one list, no folders. */
  all?: 'all' | 'favourites' | false
  /** The folder in Edit (its URL's `edit`): its name and look in place under the bar. */
  inEdit?: boolean
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const navigate = useNavigate()
  const q = useDeferredValue(filter.q)
  const laptop = useMediaQuery(LIBRARY_PANES)
  const page = useLibraryPage(
    folder,
    { ...filter, q },
    { tree: all !== false, favouritesOnly: all === 'favourites' },
  )
  // Import, from New or a file dropped on the library, made where the learner is (ADR 0107).
  const songImport = useSongImport(folder?.id ?? null)
  const drop = useSongDrop(songImport.importFile)
  // Clear search: the route fills its defaults, Favourites kept.
  const clear = () =>
    void navigate({ to: '.', search: (was) => ({ ...was, q: '' }), replace: true })
  const { view } = page
  const store = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const permits = usePermissions()
  const setSearch = useSetSearch<FolderSearch>()
  // The folder in Edit (its ✎ beside its name, in its URL): its name and look under the bar until
  // Done; the name field starts empty, its placeholder the folder's own (Mindscape's `PromptSheet`).
  const renames = folder !== null && permits('renameFolder', { builtIn: folder.builtIn })
  const [draft, setDraft] = useState<FolderEdit | null>(null)
  const editing: FolderEdit | null =
    folder && renames && inEdit
      ? (draft ?? { name: '', look: { picture: folder.picture, paint: folder.paint } })
      : null
  const done = () => {
    if (folder && editing) {
      // Nothing typed keeps its name: a built-in folder's stays its collection's, in either language.
      editFolder(store, libraryCatalog(repertoire), folder.id, {
        name: editing.name.trim() || folder.name,
        ...editing.look,
      })
    }
    setDraft(null)
    setSearch({ edit: false })
  }
  const empty = view.folders.length === 0 && view.shown === 0
  // The folder's songs archived from it (D10): its last row, Archived (n), while there are some.
  const archived = folder ? folderArchive(page.layout, folder.id).length : 0
  const screen = folder
    ? nameOf(folder)
    : all === 'favourites'
      ? t('places.favourites')
      : t('all.title')
  // The search, quiet while nothing is in the list to search; Select hides it with the count.
  const search =
    page.select.on || (empty && !view.filtering) ? null : (
      <LibrarySearch filter={filter} screen={screen} />
    )
  // How many it shows and its sort, the way it runs under a line (R72's COUNTROW and SORTMENU).
  const count =
    empty || page.select.on ? null : (
      <CountSort
        count={t('folder.songCount', { count: view.shown })}
        label={t('sort.label')}
        sort={page.sort}
        sorts={LIBRARY_SORTS.map((value) => ({ value, label: t(`sort.${value}`) }))}
        onSort={page.setSort}
        ways={{
          way: page.direction,
          options: SORT_DIRECTIONS.map((value) => ({ value, label: t(`sort.${value}`) })),
          onWay: page.setDirection,
        }}
      />
    )
  return (
    <div className="flex flex-col gap-4 pb-4" {...drop.dropProps}>
      <LibraryHeader
        page={page}
        folder={folder}
        all={all}
        add={
          laptop ? (
            <NewMenu page={page} folder={folder?.id ?? null} onImport={songImport.choose} />
          ) : undefined
        }
        edit={
          folder && renames
            ? {
                editing: editing !== null,
                onEdit: () => setSearch({ edit: true }),
                onDone: done,
              }
            : undefined
        }
      />
      {folder && editing ? (
        // As wide as the search on a laptop (520), never the page's width.
        <div className="w-full max-w-130">
          <FolderEditPanel
            value={editing}
            placeholder={nameOf(folder)}
            onChange={setDraft}
            onDone={done}
          />
        </div>
      ) : null}
      {/* A laptop sets the search (520) beside the count; a phone stacks them (the LISTPAGE board). */}
      {laptop && search ? (
        <div className="flex items-center gap-6">
          <div className="w-130 shrink-0">{search}</div>
          {count ? <div className="min-w-0 flex-1">{count}</div> : null}
        </div>
      ) : (
        <>
          {search}
          {count}
        </>
      )}
      {empty ? (
        <LibraryEmpty
          page={page}
          place={folder ? 'folder' : all === 'favourites' ? 'favourites' : 'home'}
          filter={filter}
          onClear={clear}
        />
      ) : page.select.on ? (
        // Select's bar in the rows' drag: its places take what a row's face carries.
        <LibrarySelect page={page} folder={folder}>
          <SelectionBar page={page} folder={folder} />
        </LibrarySelect>
      ) : (
        <LibraryBrowse
          page={page}
          place={folder?.id ?? 'home'}
          noFolders={all !== false}
          moreFolders={null}
          onClear={clear}
        />
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
        laptop ? null : (
          <NewActions page={page} folder={folder?.id ?? null} onImport={songImport.choose} />
        )
      ) : empty ? (
        <SelectionBar page={page} folder={folder} />
      ) : null}
      <LibraryDialogs page={page} folder={folder} />
      {songImport.view}
      {drop.panel}
    </div>
  )
}
