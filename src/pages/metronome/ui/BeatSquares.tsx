import { VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * The beat shown (ADR 0052): a square for each beat of the bar, the first larger, the one sounding
 * filled in honey; in a bar the bar trainer mutes, ringed in honey instead, "Muted" over the row.
 * The squares share the row's width, so six fit a 320px phone.
 */
export function BeatSquares({
  beats,
  sounding,
  muted,
}: {
  beats: number
  sounding: number | null
  muted: boolean
}) {
  const { t } = useTranslation('practice')
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* Kept in its place while heard, so the squares never move. */}
      <p
        aria-hidden={!muted}
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-opacity duration-150 ease-out',
          !muted && 'opacity-0',
        )}
      >
        <VolumeX aria-hidden className="size-4" />
        {t('metronome.muted')}
      </p>
      <ol
        aria-label={t('metronome.beats')}
        data-muted={muted || undefined}
        className="flex w-full max-w-md items-center justify-center gap-2 sm:gap-3"
      >
        {Array.from({ length: beats }, (_, beat) => (
          <li
            key={beat}
            aria-current={beat === sounding ? 'true' : undefined}
            className={cn(
              'aspect-square max-w-12 flex-1 rounded-xl border border-input bg-muted transition-colors duration-75 ease-out',
              beat === 0 && 'max-w-16 grow-2 rounded-2xl',
              beat === sounding &&
                (muted ? 'border-2 border-primary' : 'border-primary bg-primary'),
            )}
          >
            <span className="sr-only">{t('metronome.beat', { beat: beat + 1 })}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
