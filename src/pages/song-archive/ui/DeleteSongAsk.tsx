import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { entryTitles, usePiecesStoreApi, useRepertoire, type PieceId } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { emptyTrash } from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
import { ConfirmDialog } from '@/shared/ui'

/**
 * One song in the Trash deleted for good, asked first (R34): its takes go with it; the whole Trash
 * emptied where `song` is `'all'`.
 */
export function DeleteSongAsk({
  song,
  count,
  onOpenChange,
  onDeleted,
}: {
  song: PieceId | 'all' | null
  /** The songs the Trash holds, said when it is emptied. */
  count: number
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const library = useLibraryStoreApi()
  const pieces = usePiecesStoreApi()
  const takes = useTakesStoreApi()
  const repertoire = useRepertoire()
  const entry = song && song !== 'all' ? repertoire.entry(song) : undefined
  const all = song === 'all'
  return (
    <ConfirmDialog
      open={song !== null}
      onOpenChange={onOpenChange}
      title={
        all
          ? t('trash.emptying.title')
          : t('trash.deletingOne.title', { title: entry ? entryTitles(entry, locale).primary : '' })
      }
      body={all ? t('trash.emptying.body', { count }) : t('trash.deletingOne.body')}
      action={all ? t('trash.emptying.confirm') : t('trash.deletingOne.confirm')}
      cancel={t('trash.cancel')}
      onConfirm={() => {
        if (song === null) return
        emptyTrash({ library, pieces, takes }, libraryCatalog(repertoire), all ? undefined : [song])
        onDeleted?.()
      }}
    />
  )
}
