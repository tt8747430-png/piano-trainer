import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ProgressBar } from '@/shared/ui'
import type { Progress } from '../model/progress'

/**
 * A course's head, the canvas's CBODY value for value: its cover (132 tall, 8 more under it), its name
 * as the page's serif heading (30 on a phone, 36 on a laptop), what it teaches, its facts as one soft
 * line ("Beginner · 3 songs · 4 weeks": facts, not chips, which are values changed in place), then how
 * much is learned over the 6 meter and its one way in, the honey 50. On a laptop the cover takes the
 * head's height in a 360 column, the words beside it in a line of reading, both on one top. No card:
 * the page is its ground.
 */
export function CourseOverview({
  cover,
  title,
  summary,
  facts,
  progress,
  action,
  className,
}: {
  cover: ReactNode
  /** The course's name: the page's heading. */
  title: ReactNode
  summary?: string | undefined
  facts: readonly string[]
  progress: Progress
  /** Its one way in: Start, Continue or Review and the lesson it opens. */
  action?: ReactNode
  className?: string
}) {
  const { t } = useTranslation('learn')
  const complete = progress.total > 0 && progress.done >= progress.total
  return (
    <div
      className={cn(
        'flex flex-col gap-4 lg:grid lg:grid-cols-[22.5rem_minmax(0,40rem)] lg:items-stretch lg:gap-10',
        className,
      )}
    >
      <div className="mb-2 lg:mb-0 lg:*:h-full lg:*:min-h-33">{cover}</div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {title}
          {summary ? (
            <p className="text-base/normal text-pretty text-muted-foreground">{summary}</p>
          ) : null}
          <p className="text-sm/[normal] text-muted-foreground">{facts.join(' · ')}</p>
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
                <p className="text-sm/[normal] text-muted-foreground">
                  {t('progress', { learned: progress.done, total: progress.total })}
                </p>
                <ProgressBar done={progress.done} total={progress.total} />
              </>
            )}
            {action ? <div className="mt-1 flex">{action}</div> : null}
          </div>
        ) : action ? (
          <div className="flex">{action}</div>
        ) : null}
      </div>
    </div>
  )
}
