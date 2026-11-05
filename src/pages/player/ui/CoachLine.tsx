import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The coach's one line at the score's foot (R29 B8, R31-P): what to do now in the mode chosen ("Tap
 * Play to listen to the song.", "Play the highlighted note."), a line of soft words over the keys,
 * never a box taking a row; its ×, or doing it, puts it away for good.
 */
export function CoachLine({ mode, onClose }: { mode: PracticeMode; onClose: () => void }) {
  const { t } = useTranslation('player')
  return (
    <p
      data-slot="coach"
      className="mx-auto flex w-fit max-w-full items-center gap-1 text-sm text-muted-foreground"
    >
      <span className="min-w-0 break-words">{t(`coach.${mode}`)}</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('coach.close')}
        title={t('coach.close')}
        onClick={onClose}
      >
        <X aria-hidden />
      </Button>
    </p>
  )
}
