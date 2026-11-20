import { useTranslation } from 'react-i18next'
import { STAGES, type Stage } from '@/entities/step'

/**
 * A row's level as the libraries show it: its stage in words ("Intermediate"), as the Level filter
 * names it; `short`, as Learn numbers the levels ("Level 2"), where a phone's row has little room.
 */
export function LevelMark({ stage, short = false }: { stage: Stage; short?: boolean }) {
  const { t } = useTranslation('common')
  return (
    <span className="shrink-0 text-sm whitespace-nowrap text-muted-foreground tabular-nums">
      {short ? t('levelNumber', { number: STAGES.indexOf(stage) + 1 }) : t(`stage.${stage}`)}
    </span>
  )
}
