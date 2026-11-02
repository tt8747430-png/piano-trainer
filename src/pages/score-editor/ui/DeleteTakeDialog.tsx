import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { ConfirmDialog } from '@/shared/ui'
import { TakeName } from './TakeName'

/**
 * A take's Delete, asked once more: a take cannot be brought back. Controlled and with no trigger,
 * so it stays open once the menu or the dial that asked has folded.
 */
export function DeleteTakeDialog({
  take,
  open,
  onOpenChange,
  onDelete,
}: {
  take: Take
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}) {
  const { t } = useTranslation('editor')
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('recorder.deleting.title')}
      body={<TakeName take={take} />}
      action={t('recorder.deleting.confirm')}
      cancel={t('recorder.deleting.cancel')}
      onConfirm={onDelete}
    />
  )
}
