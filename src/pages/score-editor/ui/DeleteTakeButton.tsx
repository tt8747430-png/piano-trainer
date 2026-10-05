import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { RoundButton } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { useScoreEditorContext } from '../model/editor-context'
import { TakeName } from './TakeName'

/** A take's Delete, asked once more: a take cannot be brought back. */
export function DeleteTakeButton({ take }: { take: Take }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<RoundButton label={t('recorder.delete')} icon={Trash2} />} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('recorder.deleting.title')}</AlertDialogTitle>
          <AlertDialogDescription render={<div />}>
            <TakeName take={take} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('recorder.deleting.cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => takes.remove(take.id)}>
            {t('recorder.deleting.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
