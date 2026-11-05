import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { blankLesson, lessonById } from '@/entities/lesson'
import { selectOwnLesson, useOwnLessons } from '@/entities/own-lessons'
import { BackButton } from '@/shared/ui'
import { LessonEditor } from './LessonEditor'

/**
 * A lesson in the lesson editor (`/lessons/$lessonId/edit`): the learner's own (R30-5), kept on their
 * device; or a level's lesson, an editor's (ADR 0116), where a lesson the device does not have is a
 * new one, not published, its draft the server's.
 */
export function LessonEditorPage() {
  const navigate = useNavigate()
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId/edit' })
  const own = useOwnLessons(selectOwnLesson(lessonId))
  const lesson = own ?? lessonById(lessonId) ?? blankLesson(lessonId)
  return (
    <LessonEditor
      key={lessonId}
      lesson={lesson}
      source={own ? { kind: 'own', lesson: own } : { kind: 'draft', id: lessonId }}
      back={<BackButton />}
      toLesson={<Link to="/lessons/$lessonId" params={{ lessonId }} />}
      edit={{
        editing: true,
        onDone: () =>
          void navigate({ to: '/lessons/$lessonId', params: { lessonId }, replace: true }),
        onEdit: () => undefined,
      }}
    />
  )
}
