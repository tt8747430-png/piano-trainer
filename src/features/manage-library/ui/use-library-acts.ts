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
import { confirm, say } from '@/shared/ui'
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
    /**
     * Songs archived once asked (R17), said with Undo; from a folder (`fromFolder`), asked as hidden
     * from it, to come back from its Archived (D10).
     */
    archive: async (ids: readonly PieceId[], fromFolder = false) => {
      const [first] = ids
      if (!first) return
      const asked = await confirm(
        fromFolder
          ? {
              title:
                ids.length === 1
                  ? t('library.hiding.one', { title: titleOf(first) })
                  : t('library.hiding.many', { count: ids.length }),
              body: t('library.hiding.body'),
              action: t('library.archive'),
            }
          : {
              title:
                ids.length === 1
                  ? t('library.archiving.one', { title: titleOf(first) })
                  : t('library.archiving.many', { count: ids.length }),
              body: t('library.archiving.body'),
              action: t('library.archive'),
            },
      )
      if (!asked) return
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
    archiveChosen: async (
      ids: readonly PieceId[],
      folders: readonly ShelvedFolder[],
      fromFolder = false,
    ) => {
      const total = ids.length + folders.length
      const [chosenSong] = ids
      const [folderFirst] = folders
      if (total === 0) return
      // Songs alone, from a folder: hidden from it, to come back from its Archived (D10).
      const hiding = fromFolder && folders.length === 0
      const asked = await confirm({
        title: hiding
          ? total > 1
            ? t('library.hiding.many', { count: total })
            : t('library.hiding.one', { title: chosenSong ? titleOf(chosenSong) : '' })
          : total > 1
            ? t('library.archiving.many', { count: total })
            : chosenSong
              ? t('library.archiving.one', { title: titleOf(chosenSong) })
              : t('library.archiving.folder', { name: folderFirst ? folderName(folderFirst) : '' }),
        body: t(hiding ? 'library.hiding.body' : 'library.archiving.body'),
        action: t('library.archive'),
      })
      if (!asked) return
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
    /** A folder archived once the learner says so, with Undo; whether it was. */
    archiveFolder: async (folder: { id: FolderId; name?: string }): Promise<boolean> => {
      const asked = await confirm({
        title: t('library.archiving.folder', { name: folderName(folder) }),
        body: t('library.archiving.body'),
        action: t('library.archive'),
      })
      if (!asked) return false
      archiveFolder(store, catalog(), folder.id)
      say(
        t('library.folderArchived', { name: folderName(folder) }),
        undo(() => restoreFolder(store, catalog(), folder.id, true)),
      )
      return true
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
    /** Songs' ♡ set, counted, with Undo, which turns back only those it changed. */
    favourite: (ids: readonly PieceId[], on: boolean) => {
      const was = store.getState().favourites
      const changed = ids.filter((id) => was.includes(id) !== on)
      setFavourites(store, ids, on)
      say(
        t(on ? 'library.favourited' : 'library.unfavourited', { count: ids.length }),
        undo(() => setFavourites(store, changed, !on)),
      )
    },
  }
}

export type LibraryActs = ReturnType<typeof useLibraryActs>
