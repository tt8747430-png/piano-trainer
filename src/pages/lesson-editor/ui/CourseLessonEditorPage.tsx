import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { courseLesson } from '@/entities/course'
import { blankLesson } from '@/entities/lesson'
import { BackButton } from '@/shared/ui'
import { ReadEditSwitch } from '@/widgets/mode-switch'
import { LessonEditor } from './LessonEditor'

/**
 * A course's lesson in the lesson editor, an editor's (ADR 0116): the database's as `<course>/<lesson>`.
 * A lesson the course does not have yet is a new one, not published: its draft is the server's, and
 * its way back is the course's editor.
 */
export function CourseLessonEditorPage() {
  const navigate = useNavigate()
  const { courseId, lessonId } = useParams({ from: '/shell/courses/$courseId/$lessonId/edit' })
  const place = courseLesson(courseId, lessonId)
  const id = `${courseId}/${lessonId}`
  if (!place)
    return (
      <LessonEditor
        key={id}
        lesson={blankLesson(lessonId)}
        id={id}
        back={<BackButton fallback={{ to: '/courses/$courseId/edit', params: { courseId } }} />}
        toLesson={<Link to="/courses/$courseId/edit" params={{ courseId }} />}
      />
    )
  return (
    <LessonEditor
      key={id}
      lesson={place.lesson}
      id={id}
      back={
        <BackButton
          fallback={{ to: '/courses/$courseId/$lessonId', params: { courseId, lessonId } }}
        />
      }
      toLesson={<Link to="/courses/$courseId/$lessonId" params={{ courseId, lessonId }} />}
      modes={
        <ReadEditSwitch
          mode="edit"
          read={() =>
            void navigate({
              to: '/courses/$courseId/$lessonId',
              params: { courseId, lessonId },
              replace: true,
            })
          }
          edit={() => undefined}
        />
      }
    />
  )
}
