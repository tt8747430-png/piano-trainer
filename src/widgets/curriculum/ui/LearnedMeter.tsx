import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Progress } from '../model/progress'

/** A thin bar of how much is learned, in the learned paint. */
export function LearnedBar({ progress }: { progress: Progress }) {
  return (
    <span aria-hidden className="block h-1 flex-1 overflow-hidden rounded-full bg-muted">
      <span
        className="block h-full rounded-full bg-learned transition-[width] duration-300 ease-out"
        style={{ width: `${progress.total === 0 ? 0 : (progress.done / progress.total) * 100}%` }}
      />
    </span>
  )
}

/** How much is learned: its bar, and the count beside it. */
export function LearnedMeter({ progress, className }: { progress: Progress; className?: string }) {
  const { t } = useTranslation('learn')
  return (
    <span className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <LearnedBar progress={progress} />
      <span aria-hidden className="tabular-nums">
        {t('journey.count', { learned: progress.done, total: progress.total })}
      </span>
      <span className="sr-only">
        {t('progress', { learned: progress.done, total: progress.total })}
      </span>
    </span>
  )
}
