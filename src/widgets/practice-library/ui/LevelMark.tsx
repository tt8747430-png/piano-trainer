import { useTranslation } from 'react-i18next'
import type { Stage } from '@/entities/step'

/** A row's level as the libraries show it: its stage in words ("Intermediate"), as the Level filter names it. */
export function LevelMark({ stage }: { stage: Stage }) {
  const { t } = useTranslation('common')
  return <span className="shrink-0 text-sm text-muted-foreground">{t(`stage.${stage}`)}</span>
}
