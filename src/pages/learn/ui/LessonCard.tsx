import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { lessonsIn, useModuleName, type Lesson } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { PAGE_TILES, RowLink } from '@/shared/ui'

/** A lesson to open, on its card: its title, its module and its number in it. */
export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const moduleName = useModuleName()
  const inModule = lessonsIn(lesson.module)
  return (
    <div className="card">
      <RowLink
        title={localText(lesson.title, locale)}
        detail={`${moduleName(lesson.module)} · ${t('place', {
          n: inModule.indexOf(lesson) + 1,
          total: inModule.length,
        })}`}
        icon={PAGE_TILES.lesson.icon}
        paint={PAGE_TILES.lesson.paint}
        render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
      />
    </div>
  )
}
