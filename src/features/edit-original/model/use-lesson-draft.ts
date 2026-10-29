import { useMemo } from 'react'
import { lessonTexts, updatesLesson, type Lesson } from '@/entities/lesson'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/** Whether a lesson's every text has words in both languages: a lesson with none missing reads. */
const filled = (lesson: Lesson) =>
  lessonTexts(lesson).every(({ text }) => text.en.trim() !== '' && text.ru.trim() !== '')

/**
 * An editor's draft of a built-in lesson (ADR 0116, round 6), the database's by `id` (a course's as
 * `<course>/<lesson>`): read where it is a copy of the lesson with every text in both languages.
 */
export function useLessonDraft(lesson: Lesson, id: string) {
  const spec = useMemo<DraftSpec<Lesson>>(
    () => ({
      kind: 'lesson',
      id,
      read: (body) => (updatesLesson(lesson.id, body) && filled(body) ? body : undefined),
      write: (value) => ({ body: value, meta: { title: value.title } }),
      fallback: lesson,
    }),
    [lesson, id],
  )
  return useContentDraft(spec)
}
