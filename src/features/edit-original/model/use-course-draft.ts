import { useMemo } from 'react'
import { courseTexts, updatesCourse, type Course, type CourseTexts } from '@/entities/course'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/**
 * An editor's draft of a built-in course's own texts (ADR 0116, round 12), the database's by the
 * course's id: its title and summary, read where each has words in both languages.
 */
export function useCourseDraft(course: Course) {
  const spec = useMemo<DraftSpec<CourseTexts>>(
    () => ({
      kind: 'course',
      id: course.id,
      read: (body) => (updatesCourse(course.id, body) ? body : undefined),
      write: (value) => ({ body: value, meta: { title: value.title } }),
      fallback: courseTexts(course),
    }),
    [course],
  )
  return useContentDraft(spec)
}
