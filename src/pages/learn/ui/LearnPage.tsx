import { Link } from '@tanstack/react-router'
import { BookOpenText, ChartNoAxesColumnIncreasing, KeyboardMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LESSONS } from '@/entities/lesson'
import { LEVEL_NAME } from '@/entities/path'
import { localText, useLocale } from '@/shared/i18n'
import { RowGroup, RowLink, ScreenHeader } from '@/shared/ui'

/** Learn: the lessons, then the references to look things up in. */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('learn:title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <RowGroup title={t('learn:lessons')}>
          {LESSONS.map((lesson) => (
            <li key={lesson.id}>
              <RowLink
                title={localText(lesson.title, locale)}
                detail={`${t(`common:levelName.${LEVEL_NAME[lesson.level]}`)} · ${t(`learn:category.${lesson.category}`)}`}
                icon={BookOpenText}
                paint="grass"
                render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
              />
            </li>
          ))}
        </RowGroup>
        <RowGroup title={t('learn:references')}>
          <li>
            <RowLink
              title={t('learn:chords')}
              icon={KeyboardMusic}
              paint="sand"
              render={<Link to="/learn/chords" />}
            />
          </li>
          <li>
            <RowLink
              title={t('learn:scales')}
              icon={ChartNoAxesColumnIncreasing}
              paint="sky"
              render={<Link to="/learn/scales" />}
            />
          </li>
        </RowGroup>
      </div>
    </div>
  )
}
