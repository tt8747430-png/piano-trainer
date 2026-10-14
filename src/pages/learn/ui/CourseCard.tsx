import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { lessonsIn, MODULE_LOOK, useModuleName, type LessonModule } from '@/entities/lesson'
import { lessonStepId } from '@/entities/path'
import { selectLearned, useProgress } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

/**
 * A module as a course on Learn's shelves: its paint's band with its icon, its name, what it teaches,
 * and how much of it is learned, with its bar. The whole card opens the course's page.
 */
export function CourseCard({ module }: { module: LessonModule }) {
  const { t } = useTranslation('learn')
  const moduleName = useModuleName()
  const learned = useProgress(selectLearned)
  const lessons = lessonsIn(module)
  const done = lessons.filter((lesson) => learned[lessonStepId(lesson.id)] !== undefined).length
  const { paint, icon: Icon } = MODULE_LOOK[module]
  return (
    <Link
      to="/learn/$module"
      params={{ module }}
      className="group flex h-full flex-col overflow-hidden card transition-[translate,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-input"
    >
      <span className={cn('flex h-24 items-end justify-between px-5 pb-3', PAINT[paint].fill)}>
        <Icon aria-hidden className={cn('size-9', PAINT[paint].ink)} strokeWidth={1.75} />
        <span className={cn('text-sm font-semibold tabular-nums', PAINT[paint].ink)}>
          {t('course.count', { count: lessons.length })}
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-display text-2xl leading-tight font-semibold text-balance">
          {moduleName(module)}
        </span>
        <span className="line-clamp-3 text-muted-foreground text-pretty">
          {t(`moduleAbout.${module}`)}
        </span>
        <span className="mt-auto flex flex-col gap-2 pt-3">
          <span className="text-sm text-muted-foreground tabular-nums">
            {t('progress', { learned: done, total: lessons.length })}
          </span>
          <span aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-learned transition-[width] duration-300 ease-out"
              style={{ width: `${(done / lessons.length) * 100}%` }}
            />
          </span>
        </span>
      </span>
    </Link>
  )
}
