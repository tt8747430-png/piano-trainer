import { Link } from '@tanstack/react-router'
import { Check, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type Course, SHELF_PAINT } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { OpensMark, PAINT } from '@/shared/ui'
import { courseProgress, isComplete } from '../model/progress'
import { NextMark } from './NextMark'

/**
 * A course on its shelf (the canvas's COURSEROWS): the course's one glyph, Lucide's library, on a 44
 * tile in its shelf's paint (a check in the learned ink once complete, the tile ringed in honey where
 * Continue leads), its name over the line of what it teaches, Next beside it where Continue leads. On a
 * phone a row of the shelf's card with its chevron; on a laptop a card of its own, tapped whole, no
 * chevron.
 */
export function CourseCard({ course, current }: { course: Course; current: boolean }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const complete = isComplete(courseProgress(course, learned))
  const paint = PAINT[SHELF_PAINT[course.shelf]]
  const line = localText(course.line, locale)
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className="group flex min-h-20 items-center gap-3 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 lg:h-full lg:card lg:min-h-21 lg:py-2.5"
    >
      <span
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-thumb text-foreground',
          paint.fill,
          current && 'shadow-[0_0_0_2.5px_var(--p-honey)]',
        )}
      >
        {complete ? (
          <>
            <Check aria-hidden className="size-5 text-on-paint-grass" strokeWidth={2.6} />
            <span className="sr-only">{t('course.done')}</span>
          </>
        ) : (
          <Library aria-hidden className="size-5" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-base/snug font-semibold text-pretty">
          {localText(course.title, locale)}
        </span>
        {line ? <span className="text-sm text-muted-foreground">{line}</span> : null}
      </span>
      {current ? <NextMark size="row" /> : null}
      <OpensMark className="lg:hidden" />
    </Link>
  )
}
