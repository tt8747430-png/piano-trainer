import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  libraryCatalog,
  selectFavourites,
  selectSort,
  useFolderName,
  useLibrary,
  useLibraryLayout,
  useLibraryStoreApi,
  type FolderId,
  type LibrarySort,
  type ShelvedFolder,
} from '@/entities/library'
import {
  entryTitles,
  isOwnSongId,
  useRepertoire,
  type PieceId,
  type SongCollectionId,
} from '@/entities/piece'
import { byLastOpened, selectPractised, useProgress } from '@/entities/progress'
import {
  orderFolders,
  orderSongs,
  setSort,
  useLibraryActs,
  type FolderSheetTarget,
  type Moving,
} from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
import { libraryView } from './library-view'
import type { SongsFilter } from './songs-filter'

/** A row chosen in Select: a folder or a song, by its id. */
export type Chosen = `folder:${FolderId}` | `song:${PieceId}`
export const folderKey = (id: FolderId): Chosen => `folder:${id}`
export const songKey = (id: PieceId): Chosen => `song:${id}`

/** What the page has open over it, one at a time (CODE_STYLE §3: one union, never a flag each). */
export type Pending =
  | { readonly kind: 'move'; readonly moving: Moving; readonly what: string }
  | { readonly kind: 'folder'; readonly target: FolderSheetTarget }
  | { readonly kind: 'delete-folder'; readonly folder: ShelvedFolder }
  | { readonly kind: 'delete-songs'; readonly songs: readonly PieceId[] }
  | { readonly kind: 'delete-chosen' }
  | { readonly kind: 'new-song'; readonly builtIn?: SongCollectionId }
  | { readonly kind: 'move-in' }

/**
 * The library's page's acts (Mindscape's `use-library`), at Home (`folder` null) or in a folder:
 * what it shows under the filters and the sort, Select and what it does to the rows chosen, the
 * order dragged, and what the page has open over it.
 */
export function useLibraryPage(folder: ShelvedFolder | null, filter: SongsFilter) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const store = useLibraryStoreApi()
  const layout = useLibraryLayout()
  const repertoire = useRepertoire()
  const favourites = useLibrary(selectFavourites)
  const sort = useLibrary(selectSort)
  const practised = useProgress(selectPractised)
  const folderName = useFolderName()
  const acts = useLibraryActs()
  const navigate = useNavigate()
  const [pending, setPending] = useState<Pending | null>(null)
  const [selecting, setSelecting] = useState(false)
  const [chosen, setChosen] = useState<ReadonlySet<Chosen>>(new Set())

  const view = useMemo(() => {
    const compare = new Intl.Collator(locale).compare
    return libraryView(layout, folder?.id ?? null, filter, sort, {
      entryOf: (id) => repertoire.entry(id),
      titleOf: (entry) => entryTitles(entry, locale).primary,
      folderName,
      favourites: new Set(favourites),
      opened: byLastOpened(practised),
      compare,
      home: t('library.home'),
    })
  }, [layout, folder, filter, sort, repertoire, locale, folderName, favourites, practised, t])

  // Every row on screen, in order: what Select all chooses.
  const rows: Chosen[] = [
    ...view.folders.map((each) => folderKey(each.folder.id)),
    ...view.groups.flatMap((group) => group.entries.map((entry) => songKey(entry.id))),
  ]
  // What Select acts on: the rows chosen still in sight (a search or a filter hides the rest).
  const inSight = rows.filter((key) => chosen.has(key))
  const chosenSongs = inSight.flatMap((key) =>
    key.startsWith('song:') ? [key.slice('song:'.length)] : [],
  )
  const chosenFolders = layout.folders.filter((each) => inSight.includes(folderKey(each.id)))
  const catalog = () => libraryCatalog(repertoire)
  const exit = () => {
    setSelecting(false)
    setChosen(new Set())
  }
  const titleOf = (id: PieceId) => {
    const entry = repertoire.entry(id)
    return entry ? entryTitles(entry, locale).primary : id
  }

  return {
    layout,
    view,
    sort,
    favourites,
    pending,
    open: setPending,
    close: () => setPending(null),
    acts,
    titleOf,
    setSort: (next: LibrarySort) => setSort(store, next),
    /** Whether a drag may move the rows: only in the order the learner drags, with nothing hidden. */
    sortable: sort === 'manual' && !view.filtering,
    orderFolders: (order: FolderId[]) => orderFolders(store, catalog(), order),
    /** Opens Move to… for a song or a folder, named under the sheet's title. */
    moveOne: (moving: Moving, what: string) => setPending({ kind: 'move', moving, what }),
    orderSongs: (order: PieceId[]) => orderSongs(store, catalog(), folder?.id ?? null, order),
    select: {
      on: selecting,
      chosen,
      count: inSight.length,
      all: rows.length > 0 && rows.every((key) => chosen.has(key)),
      songs: chosenSongs,
      folders: chosenFolders,
      /** Starts Select, `first` chosen (a long press on its row), or none (the bar's Select). */
      start: (first?: Chosen) => {
        setSelecting(true)
        setChosen(new Set(first ? [first] : []))
      },
      toggle: (key: Chosen) =>
        setChosen((was) => {
          const next = new Set(was)
          if (next.has(key)) next.delete(key)
          else next.add(key)
          return next
        }),
      toggleAll: () =>
        setChosen((was) => (rows.every((key) => was.has(key)) ? new Set() : new Set(rows))),
      exit,
      /** Favourite for every song chosen; where all already are, Remove from favourites. */
      allFavourite: chosenSongs.length > 0 && chosenSongs.every((id) => favourites.includes(id)),
      favourite: () => {
        acts.favourite(chosenSongs, !chosenSongs.every((id) => favourites.includes(id)))
        exit()
      },
      move: () =>
        setPending({
          kind: 'move',
          moving: { songs: chosenSongs, folders: chosenFolders.map((each) => each.id) },
          what: t('select.count', { count: inSight.length }),
        }),
      archive: () => {
        acts.archiveChosen(chosenSongs, chosenFolders)
        exit()
      },
      /** Delete is offered where everything chosen can be: the learner's own songs, and folders. */
      deletable: inSight.length > 0 && chosenSongs.every(isOwnSongId),
      delete: () => setPending({ kind: 'delete-chosen' }),
    },
    /** Leaves a folder's page for the place it stands in: it was deleted or archived. */
    leave: () =>
      void (folder?.parent
        ? navigate({
            to: '/songs/folders/$folderId',
            params: { folderId: folder.parent },
            replace: true,
          })
        : navigate({ to: '/songs', replace: true })),
  }
}

export type LibraryPage = ReturnType<typeof useLibraryPage>
