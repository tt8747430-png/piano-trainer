import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { entryTitles, usePiecesStoreApi, useRepertoire, type PieceId } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { deleteOwnSongs } from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
import { ConfirmDialog } from '@/shared/ui'

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
    <ConfirmDialog
      open={song !== null}
      onOpenChange={onOpenChange}
      title={t('deleting.one', { title: entry ? entryTitles(entry, locale).primary : '' })}
      body={t('deleting.songs', { count: 1 })}
      action={t('deleting.confirm')}
      cancel={t('deleting.cancel')}
      onConfirm={() => {
        if (song) deleteOwnSongs({ library, pieces, takes }, libraryCatalog(repertoire), [song])
      }}
    />
  )
}
