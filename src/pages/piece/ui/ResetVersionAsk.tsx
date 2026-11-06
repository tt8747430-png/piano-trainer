import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { usePiecesStoreApi, type PieceId } from '@/entities/piece'
import { resetVersion } from '@/features/edit-piece'
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
 * The learner's version of a song reset to the book's, asked first: their chords, staves and parts
 * are lost. The page opens it (`open`) from its danger row; it has no trigger of its own, so it gives
 * the focus back to `returnTo` as it closes.
 */
export function ResetVersionAsk({
  piece,
  open,
  onOpenChange,
  returnTo,
}: {
  piece: { readonly id: PieceId; readonly title: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  /** What takes the focus as it closes: a part of the page holding the control that opened it. */
  returnTo: RefObject<HTMLElement | null>
}) {
  const { t } = useTranslation('piece')
  const store = usePiecesStoreApi()
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        finalFocus={() => returnTo.current?.querySelector<HTMLElement>('button') ?? true}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{t('resetting.title', { title: piece.title })}</AlertDialogTitle>
          <AlertDialogDescription>{t('resetting.says')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('resetting.cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => resetVersion(store, piece.id)}>
            {t('resetting.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
