import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_NAMES } from '@/entities/book'
import { lessonLearnedId, selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { LearnedBadge, LevelMark, RowGroup, RowLink, ScreenHeader } from '@/shared/ui'
import { lessonGroups } from '../model/lesson-groups'

/** A module's lessons are numbered in the order they are taught. */
const GROUPS = lessonGroups()

/**
 * Learn: the lessons, module by module in the order they are taught, each with what it is about and its
 * level. A method book's lessons are a module under its book's name.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader title={t('title')} />
      {GROUPS.map(({ module, lessons }) => (
        <RowGroup
          key={module}
          title={isMethodBookId(module) ? METHOD_BOOK_NAMES[module] : t(`module.${module}`)}
        >
          {lessons.map((lesson, i) => {
            const done = learned[lessonLearnedId(lesson.id)] !== undefined
            return (
              <li key={lesson.id}>
                <RowLink
                  title={localText(lesson.title, locale)}
                  detail={t(`category.${lesson.category}`)}
                  numeral={i + 1}
                  // Grass is learned: a lesson wears it once it is, sand before.
                  paint={done ? 'grass' : 'sand'}
                  trailing={
                    <>
                      <LevelMark level={lesson.level} />
                      {done ? <LearnedBadge label={t('common:learned.done')} /> : null}
                    </>
                  }
                  render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
                />
              </li>
            )
          })}
        </RowGroup>
      ))}
    </div>
  )
}
