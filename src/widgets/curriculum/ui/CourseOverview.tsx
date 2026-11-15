import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Progress } from '../model/progress'

/**
 * A course's overview, the canvas's course head (canvas 164) value for value: its cover, what it
 * teaches, its facts as chips (Beginner · 8 lessons · 3 songs · 4 weeks), how much is learned with
 * what comes next above a meter, then its one way in. No card: the page is its ground.
 */
export function CourseOverview({
  cover,
  summary,
  facts,
  progress,
  next,
  action,
  className,
}: {
  cover: ReactNode
  summary?: string | undefined
  facts: readonly string[]
  progress: Progress
  /** What Continue leads to, by name; none once every step is learned. */
  next?: string | undefined
  /** Its one way in: Start course, Continue, Review. */
  action?: ReactNode
  className?: string
}) {
  const { t } = useTranslation('learn')
  const complete = progress.total > 0 && progress.done >= progress.total
  const share = progress.total > 0 ? progress.done / progress.total : 0
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {cover}
      <div className="flex flex-col gap-2">
        {summary ? (
          <p className="text-[1.0625rem] leading-normal text-pretty text-muted-foreground">
            {summary}
          </p>
        ) : null}
        <ul aria-label={t('course.facts')} className="flex flex-wrap gap-1.5">
          {facts.map((fact) => (
            <li
              key={fact}
              className="flex h-7.5 items-center rounded-pill bg-muted px-3 text-sm font-semibold"
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>
      {progress.total > 0 ? (
        <div className="flex flex-col gap-2">
          {complete ? (
            <p className="flex items-center gap-2 font-semibold text-learned">
              <Check aria-hidden className="size-5" strokeWidth={3} />
              {t('course.done')}
            </p>
          ) : (
            <>
              <p className="flex justify-between gap-3 text-sm text-muted-foreground">
                {/* The count stays whole on its line; Next gives way, cut short. */}
                <span className="shrink-0 whitespace-nowrap">
                  {t('progress', { learned: progress.done, total: progress.total })}
                </span>
                {next ? (
                  <span className="min-w-0 truncate">{t('course.nextUp', { title: next })}</span>
                ) : null}
              </p>
              <span aria-hidden className="block h-1.5 rounded-full bg-muted">
                <span
                  className="block h-1.5 rounded-full bg-learned"
                  style={{ width: `${share * 100}%` }}
                />
              </span>
            </>
          )}
          {action ? <div className="mt-1 flex">{action}</div> : null}
        </div>
      ) : action ? (
        <div className="flex">{action}</div>
      ) : null}
    </div>
  )
}
