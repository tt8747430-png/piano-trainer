import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { localText, useLocale } from '@/shared/i18n'
import { PAGE_TILES, LevelMark, RowGroup, RowLink, ScreenHeader } from '@/shared/ui'
import { lessonGroups } from '../model/lesson-groups'

/** A module's lessons are numbered in the order they are taught. */
const GROUPS = lessonGroups()

/** Learn: the lessons, module by module in the order they are taught, each with what it is about and its level. */
export function LearnPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader title={t('title')} />
      {GROUPS.map((group) => (
        <RowGroup key={group.module} title={t(`module.${group.module}`)}>
          {group.lessons.map((lesson, i) => (
            <li key={lesson.id}>
              <RowLink
                title={localText(lesson.title, locale)}
                detail={t(`category.${lesson.category}`)}
                numeral={i + 1}
                paint={PAGE_TILES.lesson.paint}
                trailing={<LevelMark level={lesson.level} />}
                render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
              />
            </li>
          ))}
        </RowGroup>
      ))}
    </div>
  )
}
