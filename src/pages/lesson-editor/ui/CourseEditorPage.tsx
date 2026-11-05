import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { blankCourse, courseById } from '@/entities/course'
import { selectOwnCourse, useOwnLessons } from '@/entities/own-lessons'
import { BackButton } from '@/shared/ui'
import { CourseEditor } from './CourseEditor'

/**
 * A course in the course editor (`/courses/$courseId/edit`): the learner's own (R30-5), kept on their
 * device; or one of the app's, an editor's (ADR 0116), where a course the app does not list is one an
 * editor made and has not published, its draft the server's.
 */
export function CourseEditorPage() {
  const navigate = useNavigate()
  const { courseId } = useParams({ from: '/shell/courses/$courseId/edit' })
  const own = useOwnLessons(selectOwnCourse(courseId))
  return (
    <CourseEditor
      key={courseId}
      source={
        own
          ? { kind: 'own', course: own }
          : { kind: 'draft', course: courseById(courseId) ?? blankCourse(courseId) }
      }
      back={<BackButton />}
      toCourse={<Link to="/courses/$courseId" params={{ courseId }} />}
      edit={{
        editing: true,
        onDone: () =>
          void navigate({ to: '/courses/$courseId', params: { courseId }, replace: true }),
        onEdit: () => undefined,
      }}
    />
  )
}
