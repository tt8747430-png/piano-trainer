import { Link } from '@tanstack/react-router'
import { Check, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CourseIcon, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { courseProgress, isComplete } from '../model/progress'
import { LearnedMeter } from './LearnedMeter'

/**
 * A course on its shelf as a library's row, as the Lessons' rows are: its icon on a tile in its
 * level's paint (a check on the learned paint once complete), its name, its lessons, songs and weeks
 * in one line, how much is learned once begun, Next on the one Continue is in, and a chevron. The
 * whole row opens the course.
 */
export function CourseCard({ course, current }: { course: Course; current: boolean }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const complete = isComplete(progress)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const facts = [
    t('course.lessonCount', { count: course.lessons.length }),
    ...(course.songs.length > 0 ? [t('course.songCount', { count: course.songs.length })] : []),
    t('course.weekCount', { count: course.weeks }),
  ]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className="group flex min-h-16 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl',
          complete ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
          current && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
        )}
      >
        {complete ? (
          <>
            <Check aria-hidden className="size-5" strokeWidth={3} />
            <span className="sr-only">{t('course.done')}</span>
          </>
        ) : (
          <CourseIcon courseId={course.id} className="size-5" strokeWidth={1.75} />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-pretty">{localText(course.title, locale)}</span>
        <span className="text-sm text-muted-foreground tabular-nums">{facts.join(' · ')}</span>
        {progress.done > 0 && !complete ? (
          <LearnedMeter progress={progress} className="mt-1" />
        ) : null}
      </span>
      {current ? (
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
          {t('upNext')}
        </span>
      ) : null}
      <ChevronRight
        aria-hidden
        className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-foreground"
      />
    </Link>
  )
}
