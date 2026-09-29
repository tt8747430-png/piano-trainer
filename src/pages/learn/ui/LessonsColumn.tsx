import { Link } from '@tanstack/react-router'
import { BookOpenText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LESSON_CATEGORIES, LESSONS, type LessonCategory } from '@/entities/lesson'
import { LEVEL_NAME, LEVELS, type Level } from '@/entities/path'
import { localText, useLocale } from '@/shared/i18n'
import { Dropdown, RowGroup, RowLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import type { LearnFilter } from '../model/learn-filter'
import { lessonGroups } from '../model/lesson-groups'

/** The levels and categories Learn's lessons have: only those are worth choosing. */
const LESSON_LEVELS = LEVELS.filter((level) => LESSONS.some((lesson) => lesson.level === level))
const CATEGORIES = LESSON_CATEGORIES.filter((category) =>
  LESSONS.some((lesson) => lesson.category === category),
)

/** Learn's lessons by module, narrowed by a level and a category; one line when none is left. */
export function LessonsColumn({
  filter,
  onChange,
}: {
  filter: LearnFilter
  onChange: (change: Partial<LearnFilter>) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const groups = lessonGroups(filter)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Dropdown<Level | 'any'>
          label={t('learn:level')}
          value={filter.level}
          options={[
            { value: 'any', label: t('learn:any') },
            ...LESSON_LEVELS.map((level) => ({
              value: level,
              label: t(`common:levelName.${LEVEL_NAME[level]}`),
            })),
          ]}
          onChange={(level) => onChange({ level })}
        />
        <Dropdown<LessonCategory | 'any'>
          label={t('learn:categoryLabel')}
          value={filter.category}
          options={[
            { value: 'any', label: t('learn:any') },
            ...CATEGORIES.map((category) => ({
              value: category,
              label: t(`learn:category.${category}`),
            })),
          ]}
          onChange={(category) => onChange({ category })}
        />
      </div>
      {groups.length > 0 ? (
        groups.map((group) => (
          <RowGroup key={group.module} title={t(`learn:module.${group.module}`)}>
            {group.lessons.map((lesson) => (
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
        ))
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('learn:noLessons')}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="soft" onClick={() => onChange({ level: 'any', category: 'any' })}>
              {t('learn:everyLesson')}
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
