import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { LessonProgress } from '../model/song-progress'

/** How many of a song's or a section's lessons are done: a bar in the learned paint, "3 of 8" by it. */
export function LessonsMeter({
  progress: { done, total },
  className,
}: {
  progress: LessonProgress
  className?: string
}) {
  const { t } = useTranslation('piece')
  return (
    <span className={cn('flex items-center gap-3 text-sm text-muted-foreground', className)}>
      <span aria-hidden className="block h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-learned transition-[width] duration-300 ease-out"
          style={{ width: `${total === 0 ? 0 : (done / total) * 100}%` }}
        />
      </span>
      <span aria-hidden className="tabular-nums">
        {t('learnSong.progress', { done, total })}
      </span>
      <span className="sr-only">{t('learnSong.progressSaid', { done, total })}</span>
    </span>
  )
}
