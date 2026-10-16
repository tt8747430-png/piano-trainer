import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CourseIcon, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { courseProgress, isComplete } from '../model/progress'
import { CourseFacts } from './CourseFacts'
import { LearnedMeter } from './LearnedMeter'

/**
 * A course on its shelf, read at a glance: its icon on a tile in its level's paint (grass with a
 * check once complete), its name, its weeks, lessons and songs as pictures, and how much is learned
 * once begun. The whole card opens the course; the one Continue is in is ringed.
 */
export function CourseCard({ course, current }: { course: Course; current: boolean }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const complete = isComplete(progress)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className={cn(
        'group flex h-full items-center gap-4 card p-3 pr-4 transition-colors duration-200 ease-out hover:bg-muted',
        current && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
      )}
    >
      <span
        className={cn(
          'grid size-14 shrink-0 place-items-center rounded-2xl',
          complete ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
        )}
      >
        {complete ? (
          <>
            <Check aria-hidden className="size-6" strokeWidth={3} />
            <span className="sr-only">{t('course.done')}</span>
          </>
        ) : (
          <CourseIcon
            courseId={course.id}
            className="size-7 transition-transform duration-300 ease-out group-hover:scale-110"
            strokeWidth={1.75}
          />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="line-clamp-2 font-display text-lg leading-snug font-semibold text-balance">
          {localText(course.title, locale)}
        </span>
        {progress.done > 0 && !complete ? (
          <LearnedMeter progress={progress} />
        ) : (
          <CourseFacts course={course} className="text-sm" />
        )}
      </span>
    </Link>
  )
}
