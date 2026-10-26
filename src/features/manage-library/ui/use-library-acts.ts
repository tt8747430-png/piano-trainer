import { useTranslation } from 'react-i18next'
import {
  arrangeLibrary,
  libraryCatalog,
  useFolderName,
  useLibraryStoreApi,
  type FolderId,
  type LibraryCatalog,
} from '@/entities/library'
import { entryTitles, useRepertoire, type PieceId } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { say } from '@/shared/ui'
import { archiveFolder, restoreFolder } from '../archive-folder'
import { archiveSongs, restoreSongs } from '../archive-songs'
import { moveSongs, undoMove } from '../move-songs'
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
  /** Where a song goes, named: a folder by its name (one made a moment ago too), or Home. */
  const placeName = (to: FolderId | null) => {
    const { folders } = arrangeLibrary(store.getState(), catalog())
    const folder = to === null ? undefined : folders.find((each) => each.id === to)
    return folder ? folderName(folder) : t('library.home')
  }
  return {
    move: (ids: readonly PieceId[], to: FolderId | null) => {
      const moved = moveSongs(store, catalog(), ids, to)
      if (moved.length === 0) return
      const place = placeName(to)
      const [only] = moved
      say(
        moved.length === 1 && only
          ? t('library.moved', { title: titleOf(only.id), place })
          : t('library.movedMany', { count: moved.length, place }),
        undo(() => undoMove(store, catalog(), moved)),
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
