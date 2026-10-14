import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonUpNext } from '@/entities/lesson'
import { lessonLearnedId, selectLearned, useProgress } from '@/entities/progress'
import { LessonCard } from './LessonCard'

/**
 * The lesson to read next of all of Learn's: on from the one learned last, else the first not learned;
 * nothing once every lesson is.
 */
export function NextLesson() {
  const { t } = useTranslation('learn')
  const headingId = useId()
  const learned = useProgress(selectLearned)
  const lesson = lessonUpNext((each) => learned[lessonLearnedId(each.id)])
  if (!lesson) return null
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-2xl">
        {t('track.next')}
      </h2>
      <LessonCard lesson={lesson} />
    </section>
  )
}
