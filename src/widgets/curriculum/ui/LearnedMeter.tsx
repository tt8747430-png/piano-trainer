import { useTranslation } from 'react-i18next'
import { ProgressMeter } from '@/shared/ui'
import type { Progress } from '../model/progress'

/** How much is learned: its bar, and the count beside it. */
export function LearnedMeter({ progress, className }: { progress: Progress; className?: string }) {
  const { t } = useTranslation('learn')
  const counts = { learned: progress.done, total: progress.total }
  return (
    <ProgressMeter
      done={progress.done}
      total={progress.total}
      count={t('journey.count', counts)}
      said={t('progress', counts)}
      className={className}
    />
  )
}
