import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { usePiecesStoreApi } from '@/entities/piece'
import { deleteFolder, trashSongs } from '@/features/manage-library'
import { ConfirmDialog } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * Delete, asked first, for what Select chose where it holds folders (ADR 0106): it says what goes for
 * good (own folders), what to the Trash (own songs, R34) and what to the archive.
 */
export function DeleteAsk({ page }: { page: LibraryPage }) {
  const { t } = useTranslation('songs')
  const library = useLibraryStoreApi()
  const pieces = usePiecesStoreApi()
  const { pending, select } = page
  const open = pending?.kind === 'delete-chosen'
  const songs = open ? select.songs : []
  const folders = open ? select.folders : []
  const [only] = songs
  const title =
    songs.length === 1 && folders.length === 0 && only
      ? t('deleting.one', { title: page.titleOf(only) })
      : t('deleting.many', { count: songs.length + folders.length })
  const says = [
    songs.length > 0 ? t('deleting.songs', { count: songs.length }) : null,
    folders.length > 0 ? t('deleting.folders', { count: folders.length }) : null,
  ].filter((line) => line !== null)
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => (next ? undefined : page.close())}
      title={title}
      body={says.join(' ')}
      action={t('deleting.confirm')}
      cancel={t('deleting.cancel')}
      onConfirm={() => {
        const catalog = libraryCatalog({ ownSongs: pieces.getState().songs })
        for (const folder of folders) deleteFolder(library, catalog, folder.id)
        trashSongs(library, catalog, songs)
        select.exit()
        page.close()
      }}
    />
  )
}
