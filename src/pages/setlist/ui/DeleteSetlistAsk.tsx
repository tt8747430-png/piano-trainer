import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
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

/**
 * A setlist's Delete, asked first: it cannot be undone. Its page opens it from More, so it has no
 * trigger of its own, and gives the focus back to `returnTo` (More) as it closes.
 */
export function DeleteSetlistAsk({
  name,
  open,
  onOpenChange,
  onDelete,
  returnTo,
}: {
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
  /** What takes the focus as it closes: a part of the page holding the control that opened it. */
  returnTo: RefObject<HTMLElement | null>
}) {
  const { t } = useTranslation('songs')
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        finalFocus={() => returnTo.current?.querySelector<HTMLElement>('button') ?? true}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{t('setlist.deleting.title', { name })}</AlertDialogTitle>
          <AlertDialogDescription>{t('setlist.deleting.says')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('setlist.deleting.cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            {t('setlist.deleting.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
