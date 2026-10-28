import { useTranslation } from 'react-i18next'
import {
  arrangeLibrary,
  libraryCatalog,
  useFolderName,
  useLibraryStoreApi,
  type FolderId,
  type LibraryCatalog,
  type ShelvedFolder,
} from '@/entities/library'
import { entryTitles, useRepertoire, type PieceId } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { say } from '@/shared/ui'
import { archiveFolder, restoreFolder } from '../archive-folder'
import { archiveSongs, restoreSongs } from '../archive-songs'
import { moveTo, undoMove, type Moving } from '../move-to'
import { setFavourites } from '../toggle-favourite'

/**
 * The library's acts as a screen does them (ADR 0106): each command over the catalog as the learner
 * has it, then a toast that says what was done, with Undo where it can be undone, which puts it all
 * back exactly where it stood.
 */
export function useLibraryActs() {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const locale = useLocale()
  const folderName = useFolderName()
  const catalog = (): LibraryCatalog => libraryCatalog(repertoire)
  const undo = (run: () => void) => ({ label: t('library.undo'), onClick: run })
  const titleOf = (id: PieceId) => {
    const entry = repertoire.entry(id)
    return entry ? entryTitles(entry, locale).primary : id
  }
  /** A folder by its name as it stands now (one made a moment ago too), wherever it is. */
  const folderNameOf = (id: FolderId) => {
    const { folders } = arrangeLibrary(store.getState(), catalog())
    const folder = folders.find((each) => each.id === id)
    return folder ? folderName(folder) : ''
  }
  /** Where something goes, named: a folder by its name, or Home. */
  const placeName = (to: FolderId | null) => (to === null ? t('library.home') : folderNameOf(to))
  return {
    /** Songs and folders moved into a folder or Home, said by name where one moved, with Undo. */
    move: (what: Moving, to: FolderId | null) => {
      const moves = moveTo(store, catalog(), what, to)
      const count = moves.songs.length + moves.folders.length
      if (count === 0) return
      const place = placeName(to)
      const [song] = moves.songs
      const [folder] = moves.folders
      const named =
        count > 1 ? null : song ? titleOf(song.id) : folder ? folderNameOf(folder.id) : null
      say(
        named
          ? t('library.moved', { title: named, place })
          : t('library.movedMany', { count, place }),
        undo(() => undoMove(store, catalog(), moves)),
      )
    },
    archive: (ids: readonly PieceId[]) => {
      const archived = archiveSongs(store, catalog(), ids)
      const [only] = archived
      if (!only) return
      say(
        archived.length === 1
          ? t('library.archived', { title: titleOf(only) })
          : t('library.archivedMany', { count: archived.length }),
        undo(() => restoreSongs(store, catalog(), archived)),
      )
    },
    /**
     * What Select chose, archived in one go (songs, and folders with all they hold): one toast, its
     * Undo putting every one back exactly where it stood.
     */
    archiveChosen: (ids: readonly PieceId[], folders: readonly ShelvedFolder[]) => {
      const archived = archiveSongs(store, catalog(), ids)
      for (const folder of folders) archiveFolder(store, catalog(), folder.id)
      const [song] = archived
      const [first] = folders
      const count = archived.length + folders.length
      if (count === 0) return
      say(
        count > 1
          ? t('library.archivedMany', { count })
          : song
            ? t('library.archived', { title: titleOf(song) })
            : t('library.folderArchived', { name: first ? folderName(first) : '' }),
        undo(() => {
          // The last archived first, so each folder goes back to the place it was taken from.
          for (const folder of folders.toReversed())
            restoreFolder(store, catalog(), folder.id, true)
          restoreSongs(store, catalog(), archived)
        }),
      )
    },
    restore: (ids: readonly PieceId[]) => {
      restoreSongs(store, catalog(), ids)
      const [only] = ids
      if (only)
        say(
          ids.length === 1
            ? t('library.restored', { title: titleOf(only) })
            : t('library.restoredMany', { count: ids.length }),
        )
    },
    archiveFolder: (folder: { id: FolderId; name?: string }) => {
      archiveFolder(store, catalog(), folder.id)
      say(
        t('library.folderArchived', { name: folderName(folder) }),
        undo(() => restoreFolder(store, catalog(), folder.id, true)),
      )
    },
    restoreFolder: (folder: { id: FolderId; name?: string }) => {
      restoreFolder(store, catalog(), folder.id)
      say(t('library.restored', { title: folderName(folder) }))
    },
    /** One song's ♡ turned, said by its title, with Undo. */
    toggleFavourite: (id: PieceId) => {
      const on = !store.getState().favourites.includes(id)
      setFavourites(store, [id], on)
      say(
        t(on ? 'library.favouritedOne' : 'library.unfavouritedOne', { title: titleOf(id) }),
        undo(() => setFavourites(store, [id], !on)),
      )
    },
    favourite: (ids: readonly PieceId[], on: boolean) => {
      setFavourites(store, ids, on)
      say(t(on ? 'library.favourited' : 'library.unfavourited', { count: ids.length }))
    },
  }
}

export type LibraryActs = ReturnType<typeof useLibraryActs>
