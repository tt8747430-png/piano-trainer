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
 * A course on its shelf, read at a glance: its icon on a tile in its level's paint (a check on the
 * learned paint once complete), its name, its lessons, songs and weeks in words, and how much is
 * learned once begun. The whole card opens the course; the one Continue is in is ringed.
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
        'group flex h-full flex-col gap-3 card p-4 transition-colors duration-200 ease-out hover:bg-muted',
        current && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
      )}
    >
      <span
        className={cn(
          'grid size-12 place-items-center rounded-2xl',
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
            className="size-6 transition-transform duration-300 ease-out group-hover:scale-110"
            strokeWidth={1.75}
          />
        )}
      </span>
      <span className="font-display text-lg leading-snug font-semibold text-balance">
        {localText(course.title, locale)}
      </span>
      <span className="mt-auto flex flex-col gap-2">
        <CourseFacts course={course} className="text-sm" />
        {progress.done > 0 && !complete ? <LearnedMeter progress={progress} /> : null}
      </span>
    </Link>
  )
}
