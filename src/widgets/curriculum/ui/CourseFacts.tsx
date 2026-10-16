import { BookOpenText, CalendarDays, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Course } from '@/entities/course'
import { cn } from '@/shared/lib'

/**
 * A course's facts in words, each after its picture: its lessons, its guided songs where it has any,
 * and its weeks; after its level, where asked.
 */
export function CourseFacts({
  course,
  level = false,
  className,
}: {
  course: Course
  /** Its level too, in words, leading. */
  level?: boolean
  className?: string
}) {
  const { t } = useTranslation(['learn', 'common'])
  const facts = [
    {
      icon: BookOpenText,
      label: t('learn:course.lessonCount', { count: course.lessons.length }),
    },
    ...(course.songs.length > 0
      ? [{ icon: Music, label: t('learn:course.songCount', { count: course.songs.length }) }]
      : []),
    { icon: CalendarDays, label: t('learn:course.weekCount', { count: course.weeks }) },
  ]
  return (
    <ul
      aria-label={t('learn:course.facts')}
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground', className)}
    >
      {level ? (
        <li className="font-medium text-foreground">{t(`common:stage.${course.stage}`)}</li>
      ) : null}
      {facts.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5 tabular-nums">
          <Icon aria-hidden className="size-4 shrink-0" />
          {label}
        </li>
      ))}
    </ul>
  )
}
