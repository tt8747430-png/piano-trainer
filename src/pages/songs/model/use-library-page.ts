import { useForgetScreens } from '@/shared/lib'
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
  usePermissions,
  type FolderId,
  type LibraryAct,
  type LibrarySort,
  type ShelvedFolder,
} from '@/entities/library'
import { entryTitles, isOwnSongId, useRepertoire, type PieceId } from '@/entities/piece'
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
import type { CarryTarget } from '@/widgets/song-library'
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
  | { readonly kind: 'new-song'; readonly record?: boolean }
  | { readonly kind: 'move-in' }
  | { readonly kind: 'new-group' }
  | { readonly kind: 'export'; readonly song: PieceId }
  | { readonly kind: 'export-chosen'; readonly songs: readonly PieceId[]; readonly what: string }

/**
 * The library's page's acts (Mindscape's `use-library`), at Home (`folder` null) or in a folder:
 * what it shows under the filters and the sort, Select and what it does to the rows chosen, the
 * order dragged, and what the page has open over it.
 */
export function useLibraryPage(
  folder: ShelvedFolder | null,
  filter: SongsFilter,
  /** Beside the library's tree (a laptop's two panes): the folders are the tree's. */
  { tree = false }: { tree?: boolean } = {},
) {
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
  const permits = usePermissions()
  const navigate = useNavigate()
  const forget = useForgetScreens()
  const [pending, setPending] = useState<Pending | null>(null)
  const [selecting, setSelecting] = useState(false)
  const [chosen, setChosen] = useState<ReadonlySet<Chosen>>(new Set())

  const view = useMemo(() => {
    const compare = new Intl.Collator(locale).compare
    return libraryView(
      layout,
      folder?.id ?? null,
      filter,
      sort,
      {
        entryOf: (id) => repertoire.entry(id),
        titleOf: (entry) => entryTitles(entry, locale).primary,
        folderName,
        favourites: new Set(favourites),
        opened: byLastOpened(practised),
        compare,
        home: t('library.home'),
        allSongs: t('tree.all'),
      },
      // Every song at Home while browsing; Select drags in the library's own places.
      { tree, everySong: !tree && !selecting },
    )
  }, [layout, folder, filter, sort, repertoire, locale, folderName, favourites, practised, t, tree, selecting])

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
  /** Whether the act may be done here, in the folder open or at Home (the learner's own). */
  const may = (act: LibraryAct) => permits(act, { builtIn: folder?.builtIn ?? false })
  /** Whether a folder may be renamed, archived, deleted… itself (a built-in one, by no one). */
  const mayOnFolder = (act: LibraryAct, each: ShelvedFolder) =>
    permits(act, { builtIn: each.builtIn })
  /** Whether a song may be deleted: the learner's own alone. */
  const mayDelete = (id: PieceId) => permits('deleteSong', { builtIn: !isOwnSongId(id) })
  /**
   * Whether rows may be carried to a target: out of here, and into a folder that takes them; Archive
   * takes songs, and folders that may be archived.
   */
  const accepts = (
    songs: readonly PieceId[],
    folders: readonly ShelvedFolder[],
    target: CarryTarget,
  ) => {
    if ('into' in target) {
      const into = layout.folders.find((each) => each.id === target.into)
      return into !== undefined && may('moveOut') && permits('moveIn', { builtIn: into.builtIn })
    }
    if (target.zone === 'out') return may('moveOut')
    return (
      (songs.length === 0 || may('archiveSong')) &&
      folders.every((each) => mayOnFolder('archiveFolder', each))
    )
  }
  /** The songs and folders a list of rows' keys names. */
  const rowsOf = (keys: readonly Chosen[]) => {
    const songs = keys.flatMap((key) =>
      key.startsWith('song:') ? [key.slice('song:'.length)] : [],
    )
    const folderIds = new Set(
      keys.flatMap((key) => (key.startsWith('folder:') ? [key.slice('folder:'.length)] : [])),
    )
    return { songs, folders: layout.folders.filter((each) => folderIds.has(each.id)) }
  }
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
    /** A folder opened in Edit, its name and look in place (a folder row's Edit, as its ✎). */
    editFolder: (id: FolderId) =>
      void navigate({
        to: '/songs/folders/$folderId',
        params: { folderId: id },
        search: { edit: true },
      }),
    acts,
    titleOf,
    may,
    mayOnFolder,
    mayDelete,
    /** Songs archived, asked first: in a folder, hidden from it (D10), brought back from its Archived. */
    archive: (ids: readonly PieceId[]) => acts.archive(ids, folder !== null),
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
      /** Export… for the songs chosen: each one's file. */
      export: () =>
        setPending({
          kind: 'export-chosen',
          songs: chosenSongs,
          what: t('select.count', { count: chosenSongs.length }),
        }),
      archive: () => {
        acts.archiveChosen(chosenSongs, chosenFolders, folder !== null)
        exit()
      },
      /** What a row's face carries: every row chosen in sight where it is chosen, else itself. */
      carried: (key: Chosen): Chosen[] => (chosen.has(key) ? inSight : [key]),
      /**
       * What was carried, dropped (ADR 0106): into a folder, out to the place this folder stands in,
       * or on Archive; said in a toast with Undo, as Move to… and Archive say it. It ends Select.
       */
      /** Whether a target takes what is carried (the permission table): one refused is not offered. */
      accepts: (keys: readonly Chosen[], target: CarryTarget) => {
        const { songs, folders } = rowsOf(keys)
        return accepts(songs, folders, target)
      },
      carry: (keys: readonly Chosen[], target: CarryTarget) => {
        const { songs, folders } = rowsOf(keys)
        if (!accepts(songs, folders, target)) return
        const moving = { songs, folders: folders.map((each) => each.id) }
        const into =
          'into' in target ? layout.folders.find((each) => each.id === target.into) : undefined
        if (into) acts.move(moving, into.id)
        else if ('zone' in target && target.zone === 'out')
          acts.move(moving, folder?.parent ?? null)
        else if ('zone' in target && target.zone === 'archive')
          acts.archiveChosen(songs, folders, folder !== null)
        else return
        exit()
      },
      /** Move is offered where what is chosen may leave this place. */
      movable: inSight.length > 0 && may('moveOut'),
      /** Archive, where every song and every folder chosen may be archived. */
      archivable:
        inSight.length > 0 &&
        (chosenSongs.length === 0 || may('archiveSong')) &&
        chosenFolders.every((each) => mayOnFolder('archiveFolder', each)),
      /** Delete is offered where everything chosen can be: the learner's own songs, and own folders. */
      deletable:
        inSight.length > 0 &&
        chosenSongs.every(mayDelete) &&
        chosenFolders.every((each) => mayOnFolder('deleteFolder', each)),
      delete: () => setPending({ kind: 'delete-chosen' }),
    },
    /** Leaves a folder's page for the place it stands in: it was deleted or archived. */
    leave: () => {
      if (folder) forget(`/songs/folders/${folder.id}`)
      void (folder?.parent
        ? navigate({
            to: '/songs/folders/$folderId',
            params: { folderId: folder.parent },
            replace: true,
          })
        : navigate({ to: '/songs', replace: true }))
    },
  }
}

export type LibraryPage = ReturnType<typeof useLibraryPage>
