import { Link } from '@tanstack/react-router'
import { BackButton } from '@/shared/ui'
import { CourseOrderEditor } from './CourseOrderEditor'

/** Manage courses, an editor's (content as data, ADR 0116 r25). */
export function CourseOrderEditorPage() {
  const courses = { to: '/', search: { view: 'courses' } } as const
  return (
    <CourseOrderEditor back={<BackButton fallback={courses} />} toCourses={<Link {...courses} />} />
  )
}
