import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpenText } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { selectOwnLessons, useOwnLessons, useOwnLessonsStoreApi } from '@/entities/own-lessons'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { createOwnLesson } from '@/features/manage-own-lessons'
import { localText, useLocale } from '@/shared/i18n'
import { PAINT } from '@/shared/ui'
import { lessonShare } from '../model/progress'
import { LessonRow } from './LessonRow'
import { NewRow } from './NewRow'

/**
 * Your lessons (R30-5), the Lessons' chip after the levels: the lessons the learner wrote, each a row
 * as a level's lesson is (learned, read so far), then New lesson, which names one and opens it in the
 * lesson editor. They count towards no level.
 */
export function OwnLessons() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const headingId = useId()
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const lessons = useOwnLessons(selectOwnLessons)
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const done = lessons.filter((lesson) => learned[lessonStepId(lesson.id)] !== undefined).length
  const create = (name: string) => {
    const id = createOwnLesson(store, name)
    if (id) void navigate({ to: '/lessons/$lessonId/edit', params: { lessonId: id } })
    return id !== null
  }
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 px-3">
        <h2 id={headingId} className="text-2xl font-semibold text-balance">
          {t('own.lessons')}
        </h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {lessons.length === 0
            ? t('own.noLessons')
            : t('own.lessonsLearned', { learned: done, total: lessons.length })}
        </p>
      </div>
      <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
        {lessons.map((lesson) => {
          const step = lessonStepId(lesson.id)
          const learnedIt = learned[step] !== undefined
          return (
            <li key={lesson.id}>
              <LessonRow
                render={<Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
                mark={<BookOpenText className="size-5" strokeWidth={1.75} />}
                paint={PAINT.sand}
                done={learnedIt}
                share={lessonShare(lesson.sections.length, read[step], learnedIt)}
                title={localText(lesson.title, locale)}
                detail={t('own.sectionCount', { count: lesson.sections.length })}
              />
            </li>
          )
        })}
        <li>
          <NewRow
            label={t('own.newLesson')}
            createLabel={t('own.createLesson')}
            onCreate={create}
          />
        </li>
      </ul>
    </section>
  )
}
