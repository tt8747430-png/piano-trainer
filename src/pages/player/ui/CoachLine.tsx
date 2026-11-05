import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The coach's one line for the mode chosen ("Press Play to hear the song.") (R29 B8, R31-P, R32): a
 * slim capsule floating over the music's foot, taking no row of the screen and covering none of the
 * keys' or the transport's controls. Its ×, or doing what it says, dismisses it for good.
 */
export function CoachLine({ mode, onClose }: { mode: PracticeMode; onClose: () => void }) {
  const { t } = useTranslation('player')
  return (
    <p
      data-slot="coach"
      className="absolute bottom-2 left-1/2 z-30 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1 rounded-pill bg-card ps-4 text-sm text-foreground elevation-2"
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-primary" />
      <span className="min-w-0 ps-1 break-words">{t(`coach.${mode}`)}</span>
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
