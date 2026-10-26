import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { entryTitles, usePiecesStoreApi, useRepertoire, type PieceId } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { deleteOwnSongs } from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
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

/** An archived song of the learner's own deleted for good, asked first: its takes go with it. */
export function DeleteSongAsk({
  song,
  onOpenChange,
}: {
  song: PieceId | null
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const library = useLibraryStoreApi()
  const pieces = usePiecesStoreApi()
  const takes = useTakesStoreApi()
  const repertoire = useRepertoire()
  const entry = song ? repertoire.entry(song) : undefined
  return (
    <AlertDialog open={song !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('deleting.one', { title: entry ? entryTitles(entry, locale).primary : '' })}
          </AlertDialogTitle>
          <AlertDialogDescription>{t('deleting.songs', { count: 1 })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleting.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (song)
                deleteOwnSongs({ library, pieces, takes }, libraryCatalog(repertoire), [song])
            }}
          >
            {t('deleting.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
