import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { usePiecesStoreApi } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { deleteFolder, deleteOwnSongs } from '@/features/manage-library'
import { ConfirmDialog } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * Delete, asked first, for the learner's own songs (a row's Delete) or for what Select chose (its
 * own songs and its folders, ADR 0106): it says what goes for good and what goes to the archive.
 */
export function DeleteAsk({ page }: { page: LibraryPage }) {
  const { t } = useTranslation('songs')
  const library = useLibraryStoreApi()
  const pieces = usePiecesStoreApi()
  const takes = useTakesStoreApi()
  const { pending, select } = page
  const songs =
    pending?.kind === 'delete-songs'
      ? pending.songs
      : pending?.kind === 'delete-chosen'
        ? select.songs
        : []
  const folders = pending?.kind === 'delete-chosen' ? select.folders : []
  const open = pending?.kind === 'delete-songs' || pending?.kind === 'delete-chosen'
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
        const stores = { library, pieces, takes }
        // Read again before each: a folder deleted takes its own songs with it.
        const catalog = () => libraryCatalog({ ownSongs: pieces.getState().songs })
        for (const folder of folders) deleteFolder(stores, catalog(), folder.id)
        deleteOwnSongs(stores, catalog(), songs)
        if (pending?.kind === 'delete-chosen') select.exit()
        page.close()
      }}
    />
  )
}
