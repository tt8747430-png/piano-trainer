import { useTranslation } from 'react-i18next'
import { ProgressMeter } from '@/shared/ui'
import type { LessonProgress } from '../model/song-progress'

/** How many of a song's or a section's lessons are done: its bar, "3 of 8" by it. */
export function LessonsMeter({
  progress: { done, total },
  className,
}: {
  progress: LessonProgress
  className?: string
}) {
  const { t } = useTranslation('piece')
  return (
    <ProgressMeter
      done={done}
      total={total}
      count={t('learnSong.progress', { done, total })}
      said={t('learnSong.progressSaid', { done, total })}
      className={className}
    />
  )
}
