import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * The beat shown (ADR 0113): a square for each beat of the bar, the first larger, the one sounding
 * filled in honey. The squares share the row's width, so six fit a 320px phone.
 */
export function BeatSquares({ beats, sounding }: { beats: number; sounding: number | null }) {
  const { t } = useTranslation('practice')
  return (
    <ol
      aria-label={t('metronome.beats')}
      className="flex w-full max-w-md items-center justify-center gap-2 sm:gap-3"
    >
      {Array.from({ length: beats }, (_, beat) => (
        <li
          key={beat}
          aria-current={beat === sounding ? 'true' : undefined}
          className={cn(
            'aspect-square max-w-12 flex-1 rounded-xl border border-input bg-muted transition-colors duration-75 ease-out',
            beat === 0 && 'max-w-16 grow-2 rounded-2xl',
            beat === sounding && 'border-primary bg-primary',
          )}
        >
          <span className="sr-only">{t('metronome.beat', { beat: beat + 1 })}</span>
        </li>
      ))}
    </ol>
  )
}
