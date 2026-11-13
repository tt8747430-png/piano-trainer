import { useTranslation } from 'react-i18next'
import { ProgressMeter } from '@/shared/ui'
import type { Progress } from '../model/progress'

/** How much is learned: its bar, and "6 of 13 learned" beside it (canvas 128). */
export function LearnedMeter({ progress, className }: { progress: Progress; className?: string }) {
  const { t } = useTranslation('learn')
  const counts = { learned: progress.done, total: progress.total }
  return (
    <ProgressMeter
      done={progress.done}
      total={progress.total}
      count={t('progress', counts)}
      said={t('progress', counts)}
      className={className}
    />
  )
}
