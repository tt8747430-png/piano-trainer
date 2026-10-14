import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { MethodBookId } from '@/entities/book'
import { lessonsIn, useModuleName } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/path'
import { PAGE_TILES, RowGroup, RowLink } from '@/shared/ui'

/**
 * A method book's lessons, from its part of Accompaniment: its course's page on Learn, with how much of
 * it is learned. A book's patterns, pieces and lessons are one course, reached from either place.
 */
export function BookLessons({ book }: { book: MethodBookId }) {
  const { t } = useTranslation(['practice', 'learn'])
  const moduleName = useModuleName()
  const learned = useProgress(selectLearned)
  const lessons = lessonsIn(book)
  const done = lessons.filter((lesson) => learned[lessonStepId(lesson.id)] !== undefined)
  return (
    <RowGroup title={t('practice:accompaniment.lessons')}>
      <li>
        <RowLink
          title={moduleName(book)}
          detail={t('learn:progress', { learned: done.length, total: lessons.length })}
          {...PAGE_TILES.lesson}
          render={<Link to="/learn/$module" params={{ module: book }} />}
        />
      </li>
    </RowGroup>
  )
}
