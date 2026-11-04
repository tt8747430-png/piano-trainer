import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** Which of the piano's pedals are down now. */
export interface PedalsDown {
  readonly sustain: boolean
  readonly sostenuto: boolean
  readonly soft: boolean
}

const PEDALS = ['sustain', 'sostenuto', 'soft'] as const

/**
 * The pedals under the keys (R29 A26): a thin bar along the keys' foot, a segment a pedal, lit and
 * named while it is down, whoever holds it (the rail's toggle, Space or a MIDI foot). Sostenuto and
 * soft take a segment only once they have been pressed this visit: a touch screen has neither.
 */
export function PedalBar({ sustain, sostenuto, soft }: PedalsDown) {
  const { t } = useTranslation('common')
  const down = { sustain, sostenuto, soft }
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set(['sustain']))
  const pressed = PEDALS.filter((pedal) => down[pedal] && !seen.has(pedal))
  if (pressed.length > 0) setSeen(new Set([...seen, ...pressed]))
  const shown = PEDALS.filter((pedal) => seen.has(pedal) || down[pedal])
  return (
    <div
      role="group"
      aria-label={t('pedals.label')}
      className="flex h-4 shrink-0 gap-0.5 bg-key-bed px-0.5 pb-0.5"
    >
      {shown.map((pedal) => (
        <span
          key={pedal}
          data-pedal={pedal}
          data-down={down[pedal]}
          className={cn(
            'grid flex-1 place-items-center rounded-control text-[10px] leading-none font-semibold transition-colors duration-150 motion-reduce:transition-none',
            down[pedal] ? 'bg-ring text-background' : 'bg-transparent text-transparent',
          )}
        >
          {down[pedal] ? (
            t(`pedals.${pedal}`)
          ) : (
            <span className="sr-only">{t(`pedals.${pedal}`)}</span>
          )}
        </span>
      ))}
    </div>
  )
}
