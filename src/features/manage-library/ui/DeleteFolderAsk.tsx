import { useTranslation } from 'react-i18next'
import {
  libraryCatalog,
  useFolderName,
  useLibraryStoreApi,
  type ShelvedFolder,
} from '@/entities/library'
import { isOwnSongId, usePiecesStoreApi, useRepertoire } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { deleteFolder } from '../delete-folder'

/**
 * Delete folder, asked first (ADR 0106): it names the folder, counts its songs and says what happens
 * to them: the learner's own deleted for good with their takes, the app's to the archive, a built-in
 * folder whole with them. `onDeleted` hears it went (its page leaves first).
 */
export function DeleteFolderAsk({
  folder,
  onOpenChange,
  onDeleted,
}: {
  /** The folder asked about; none while it is shut. */
  folder: ShelvedFolder | null
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}) {
  const { t } = useTranslation('songs')
  const library = useLibraryStoreApi()
  const pieces = usePiecesStoreApi()
  const takes = useTakesStoreApi()
  const repertoire = useRepertoire()
  const nameOf = useFolderName()
  const own = folder?.songs.filter(isOwnSongId).length ?? 0
  const app = (folder?.songs.length ?? 0) - own
  const says = folder
    ? [
        folder.builtIn ? t('folder.deleting.builtIn', { count: app }) : t('folder.deleting.own'),
        own > 0 ? t('folder.deleting.ownSongs', { count: own }) : null,
        !folder.builtIn && app > 0 ? t('folder.deleting.appSongs', { count: app }) : null,
      ].filter((line) => line !== null)
    : []
  return (
    <AlertDialog open={folder !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('folder.deleting.title', { name: folder ? nameOf(folder) : '' })}
          </AlertDialogTitle>
          <AlertDialogDescription>{says.join(' ')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('folder.deleting.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (!folder) return
              onDeleted?.()
              deleteFolder({ library, pieces, takes }, libraryCatalog(repertoire), folder.id)
            }}
          >
            {t('folder.deleting.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
