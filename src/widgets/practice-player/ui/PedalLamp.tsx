import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * The pedal's lamp at the end of the keys' rail (A27, Show it), as a digital piano lights its pedal:
 * "Ped." lit while the music's sustain pedal is down, dim while it is up; a screen reader hears
 * which.
 */
export function PedalLamp({ down }: { down: boolean }) {
  const { t } = useTranslation('player')
  return (
    <span
      role="img"
      data-slot="pedal-lamp"
      data-down={down || undefined}
      aria-label={down ? t('pedalLamp.down') : t('pedalLamp.up')}
      className={cn(
        'grid h-8 min-w-11 place-items-center rounded-pill px-2 font-music text-base transition-colors duration-200 ease-out motion-reduce:transition-none',
        down ? 'bg-ring text-background' : 'text-muted-foreground/60',
      )}
    >
      {t('pedalLamp.mark')}
    </span>
  )
}
