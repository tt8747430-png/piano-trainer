import { BookOpenText, CalendarDays, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Course } from '@/entities/course'
import { cn } from '@/shared/lib'

/**
 * A course's facts as pictures with their numbers (after its level in words, where asked): its weeks, its lessons and, where it has any, its
 * guided songs; each named in words for a screen reader and on hover.
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
      icon: CalendarDays,
      count: course.weeks,
      label: t('learn:course.weeks', { count: course.weeks }),
    },
    {
      icon: BookOpenText,
      count: course.lessons.length,
      label: t('learn:course.lessonCount', { count: course.lessons.length }),
    },
    ...(course.songs.length > 0
      ? [
          {
            icon: Music,
            count: course.songs.length,
            label: t('learn:course.songCount', { count: course.songs.length }),
          },
        ]
      : []),
  ]
  return (
    <ul
      aria-label={t('learn:course.facts')}
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground', className)}
    >
      {level ? (
        <li className="font-medium text-foreground">{t(`common:stage.${course.stage}`)}</li>
      ) : null}
      {facts.map(({ icon: Icon, count, label }) => (
        <li key={label} title={label} className="inline-flex items-center gap-1.5 tabular-nums">
          <Icon aria-hidden className="size-4" />
          <span aria-hidden>{count}</span>
          <span className="sr-only">{label}</span>
        </li>
      ))}
    </ul>
  )
}
