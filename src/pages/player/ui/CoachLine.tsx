import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The coach's one line at the score's foot (R29 B8): what to do now in the mode chosen ("Tap Play
 * to listen to the song.", "Play the highlighted note."), in the status line under the music; its × puts it away
 * for the visit.
 */
export function CoachLine({ mode, onClose }: { mode: PracticeMode; onClose: () => void }) {
  const { t } = useTranslation('player')
  return (
    <p
      data-slot="coach"
      className="card mx-auto flex w-fit max-w-full items-center gap-1 py-0.5 pr-0.5 pl-3 text-sm"
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
