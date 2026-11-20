import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { entryTitles, usePiecesStoreApi, useRepertoire, type PieceId } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { emptyTrash } from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
import { ConfirmDialog } from '@/shared/ui'

/**
 * Songs in the Trash deleted for good, asked first (R34): their takes go with them; the whole Trash
 * emptied where `songs` is `'all'`; one named by its title.
 */
export function DeleteSongAsk({
  songs,
  count,
  onOpenChange,
  onDeleted,
}: {
  songs: readonly PieceId[] | 'all' | null
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
  const all = songs === 'all'
  const one = songs !== null && !all && songs.length === 1 ? songs[0] : undefined
  const entry = one ? repertoire.entry(one) : undefined
  return (
    <ConfirmDialog
      open={songs !== null}
      onOpenChange={onOpenChange}
      title={
        all
          ? t('trash.emptying.title')
          : entry
            ? t('trash.deletingOne.title', { title: entryTitles(entry, locale).primary })
            : t('trash.deletingMany.title', { count: songs?.length ?? 0 })
      }
      body={
        all
          ? t('trash.emptying.body', { count })
          : entry
            ? t('trash.deletingOne.body')
            : t('trash.deletingMany.body')
      }
      action={all ? t('trash.emptying.confirm') : t('trash.deletingOne.confirm')}
      cancel={t('trash.cancel')}
      onConfirm={() => {
        if (songs === null) return
        emptyTrash({ library, pieces, takes }, libraryCatalog(repertoire), all ? undefined : songs)
        onDeleted?.()
      }}
    />
  )
}
