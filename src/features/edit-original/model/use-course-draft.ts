import { useMemo } from 'react'
import {
  courseRecord,
  isCourseRecord,
  updatesCourse,
  type Course,
  type CourseRecord,
} from '@/entities/course'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/**
 * An editor's draft of a built-in course's own texts (ADR 0116, round 12), the database's by the
 * course's id: its title, summary and lessons in order, published once the title and summary have
 * words in both languages.
 */
export function useCourseDraft(course: Course) {
  const spec = useMemo<DraftSpec<CourseRecord>>(
    () => ({
      kind: 'course',
      id: course.id,
      read: (body) => (isCourseRecord(course.id, body) ? body : undefined),
      publishable: (value) => updatesCourse(course.id, value),
      write: (value) => ({ body: value, meta: { title: value.title } }),
      fallback: courseRecord(course),
    }),
    [course],
  )
  return useContentDraft(spec)
}
