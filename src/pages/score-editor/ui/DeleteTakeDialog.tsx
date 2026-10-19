import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('recorder.deleting.title')}</AlertDialogTitle>
          <AlertDialogDescription render={<div />}>
            <TakeName take={take} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('recorder.deleting.cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            {t('recorder.deleting.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
