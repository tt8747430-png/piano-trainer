import { Link, useParams } from '@tanstack/react-router'
import { courseById } from '@/entities/course'
import { BackButton } from '@/shared/ui'
import { CourseEditor } from './CourseEditor'

/** A course's title and summary in the course editor, an editor's (ADR 0116, round 12). */
export function CourseEditorPage() {
  const { courseId } = useParams({ from: '/shell/courses/$courseId/edit' })
  const course = courseById(courseId)
  // The route finds no course that is not there.
  if (!course) return null
  return (
    <CourseEditor
      key={courseId}
      course={course}
      back={<BackButton fallback={{ to: '/courses/$courseId', params: { courseId } }} />}
      toCourse={<Link to="/courses/$courseId" params={{ courseId }} />}
    />
  )
}
