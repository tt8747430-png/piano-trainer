import { useMemo } from 'react'
import { allCourses, COURSE_ORDER_ID, isCourseOrder, type CourseOrder } from '@/entities/course'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/**
 * An editor's draft of the courses' own order (content as data, ADR 0116 r25): every course's id as
 * Manage courses dragged them, kept whole as `catalog` `courses`; the courses as Courses lists them
 * where none is published.
 */
export function useCourseOrderDraft() {
  const spec = useMemo<DraftSpec<CourseOrder>>(
    () => ({
      kind: 'catalog',
      id: COURSE_ORDER_ID,
      read: (body) => (isCourseOrder(body) ? body : undefined),
      write: (value) => ({ body: value, meta: {} }),
      fallback: { courses: allCourses().map((course) => course.id) },
    }),
    [],
  )
  return useContentDraft(spec)
}
