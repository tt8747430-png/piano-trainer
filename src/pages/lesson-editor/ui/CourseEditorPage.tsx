import { Link, useParams } from '@tanstack/react-router'
import { blankCourse, courseById } from '@/entities/course'
import { BackButton } from '@/shared/ui'
import { CourseEditor } from './CourseEditor'

/**
 * A course in the course editor, an editor's (ADR 0116). A course the app does not list is one an
 * editor made and has not published: its draft is the server's.
 */
export function CourseEditorPage() {
  const { courseId } = useParams({ from: '/shell/courses/$courseId/edit' })
  const course = courseById(courseId) ?? blankCourse(courseId)
  return (
    <CourseEditor
      key={courseId}
      course={course}
      back={<BackButton fallback={{ to: '/courses/$courseId', params: { courseId } }} />}
      toCourse={<Link to="/courses/$courseId" params={{ courseId }} />}
    />
  )
}
