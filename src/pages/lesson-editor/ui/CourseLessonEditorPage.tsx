import { Link, useParams } from '@tanstack/react-router'
import { courseLesson } from '@/entities/course'
import { BackButton } from '@/shared/ui'
import { LessonEditor } from './LessonEditor'

/** A course's lesson in the lesson editor, an editor's (ADR 0116): the database's as `<course>/<lesson>`. */
export function CourseLessonEditorPage() {
  const { courseId, lessonId } = useParams({ from: '/shell/courses/$courseId/$lessonId/edit' })
  const place = courseLesson(courseId, lessonId)
  // The route finds no lesson its course does not have.
  if (!place) return null
  return (
    <LessonEditor
      key={`${courseId}/${lessonId}`}
      lesson={place.lesson}
      id={`${courseId}/${lessonId}`}
      back={
        <BackButton
          fallback={{ to: '/courses/$courseId/$lessonId', params: { courseId, lessonId } }}
        />
      }
      toLesson={<Link to="/courses/$courseId/$lessonId" params={{ courseId, lessonId }} />}
    />
  )
}
