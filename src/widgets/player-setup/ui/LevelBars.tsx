import { useTranslation } from 'react-i18next'
import { stageRank, type Stage } from '@/entities/step'
import { cn } from '@/shared/lib'

/** The bars, shortest first: as many filled as the level is high, the professional's all three. */
const BARS = ['h-1.5', 'h-2.25', 'h-3'] as const

/** A row's level as a picture (the PlayerApp board's pips): three rising bars, named by the level. */
export function LevelBars({ stage }: { stage: Stage }) {
  const { t } = useTranslation('common')
  const name = t(`stage.${stage}`)
  const filled = Math.min(stageRank(stage), BARS.length)
  return (
    <span role="img" aria-label={name} title={name} className="flex h-3 shrink-0 items-end gap-0.5">
      {BARS.map((height, at) => (
        <span
          key={height}
          className={cn('w-0.75', height, at < filled ? 'bg-muted-foreground' : 'bg-border')}
        />
      ))}
    </span>
  )
}
